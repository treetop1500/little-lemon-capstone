import React, { useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Pressable, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { debounce } from 'lodash'; 

export default function Home({navigation}) {
  
  const [data, setData] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedKeywordSearch = debounce(async (text) => {
    await keywordSearch(text);
  }, 500);

  useEffect(() => {
    checkAndFetchData();
  }, []);

  useEffect(() => {
    if (data != [] && menuCategories.length < 1) {
      setMenuCategories([...new Set(data.map(item => item.category))])
    }
  }, [data]);

  useEffect(() => {
    console.log(searchTerm);
  keywordSearch(searchTerm);
    debouncedKeywordSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    console.log('selectedCategory', selectedCategory);
  }, [selectedCategory]);


  const keywordSearch = async () => {
    console.log('keyword search');
    if (selectedCategory != null) {
      setSelectedCategory(null);
    }
    const db = SQLite.openDatabase('little_lemon.db');
  
    if (searchTerm !== '') {
      console.log(searchTerm);
        try {
          db.transaction(
            (tx) => {
              tx.executeSql(
                `SELECT * FROM menu WHERE name LIKE ?`,
                [`%${searchTerm}%`],
                (_, results) => {
                  console.log(results);
                  const rows = results.rows;
                  console.log(rows.length);
  
                  if (rows.length > 0) {
                    const data = rows._array;
                    setData(data);
                  } 
                }
              );
            }
          );
        } catch (error) {
          console.error('Error in keywordSearch:', error);
          reject(error);
        }
      ;
    } else {
      checkAndFetchData();
    }
  };

  const checkAndFetchData = async () => {
    const db = SQLite.openDatabase('little_lemon.db');
  
    return new Promise((resolve, reject) => {
      try {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM menu',
              [],
              (_, results) => {
                const rows = results.rows;
  
                if (rows.length > 0) {
                  // Data exists in the database, use it
                  const data = rows._array; // Convert rows to an array
                  setData(data);
                  resolve(data);
                } else {
                  // Data doesn't exist in the database, fetch and store it
                  fetchDataAndStoreInDatabase()
                    .then((data) => {
                      resolve(data); // Resolve with the fetched data
                    })
                    .catch((fetchError) => {
                      reject(fetchError); // Reject if there's an error in fetching data
                    });
                }
              },
              (error) => {
                reject(error);
                console.log("3333333", error)
              }
            );
          },
          (error) => {
            reject(error);
            console.log("44444444", error)
          }
        );
      } catch (error) {
        console.error('Error in checkAndFetchData:', error);
        reject(error);
      }
    });
  };

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    const db = SQLite.openDatabase('little_lemon.db');
  
    return new Promise((resolve, reject) => {
      try {
        if (category !== selectedCategory) {
          db.transaction(
            (tx) => {
              tx.executeSql(
                `SELECT * FROM menu WHERE category = ?`,
                [category],
                (_, results) => {
                  const rows = results.rows;
  
                  if (rows.length > 0) {
                    // Data exists in the database, use it
                    const data = rows._array; // Convert rows to an array
                    setData(data);
                    resolve(data);
                  } else {
                    // Data doesn't exist in the database, fetch and store it
                    resolve([]); // Resolve with an empty array since no data is in the database
                  }
                },
                (error) => {
                  reject(error);
                  console.log("55555", error)
                }
              );
            },
            (error) => {
              reject(error);
              console.log("666666", error)
            }
          );
        } else {
          resolve([]); // No need to execute the transaction, resolve with an empty array
        }
      } catch (error) {
        console.error('Error in handleCategoryPress:', error);
        reject(error);
      }
    });
  };

  
  const fetchDataAndStoreInDatabase = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
      const jsonData = await response.json();
      // Store the fetched data in the database
      storeDataInDatabase(jsonData.menu);
      // Use the fetched data or set it in your component state
    } catch (error) {
      console.log(error);
    }
  };
  

  const storeDataInDatabase = (dataToStore) => {
    const db = SQLite.openDatabase('little_lemon.db');
    
    return new Promise((resolve, reject) => {
      try {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price REAL, description TEXT, image TEXT, category TEXT)',
              [],
              (_, results) => {
                // Table creation success, proceed to insert data
                dataToStore.forEach((item, index) => {
                  tx.executeSql(
                    'INSERT INTO menu (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)',
                    [index, item.name, item.price, item.description, item.image, item.category],
                    (_, results) => {
                      // Insert success
                    },
                    (error) => {
                      reject(error);
                      console.log("7777777", error)
                    }
                  );
                });
              },
              (error) => {
                reject(error);
                console.log("888888", error)
              }
            );
          },
          (error) => {
            reject(error);
            console.log("999999", error)
          },
          () => {
            // Transaction completed successfully
            resolve();
          }
        );
      } catch (error) {
        console.error('Error in storeDataInDatabase:', error);
        reject(error);
      }
    });
  };

  const SearchIcon = () => (
    <Image source={require('../assets/images/search_icon.png')} style={styles.searchIcon} />
  )

  // FlatList Item
  const Item = ({title,price,image,description}) => (
    <View style={styles.menuListItem}>
      <View style={{flex: '70%'}}>
        <Text style={styles.h3}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <View>
        <Image
            style={styles.menuListImage}
            source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}}
          />
        </View>
      </View>
  );

  return (
    <ScrollView style={{flex:1}}>
      <View style={styles.mainHeader}>
        <Text style={styles.welcomeText}>Little Lemon</Text>
        <View style={styles.welcomeWrapper}>
          <View style={{width: '60%'}}>
            <Text style={styles.welcomeSubtext}>Chicago</Text>
            <Text style={styles.welcomeBody}>We are a family owned Mediterranean restaurant, focused on traditional recipes werved with a modern twist.</Text>
          </View>
          <View style={{width: '35%'}}>
          <Image
              style={styles.welcomeImage}
              source={require('../assets/images/Hero.png')}
            />
          </View>
        </View>
          <TextInput style={styles.input} onChangeText={setSearchTerm} />
          <SearchIcon/>
      </View>
      <View style={styles.mainBody}>
        <Text style={styles.h2}>ORDER FOR DELIVERY</Text>

        {menuCategories &&
            
          <FlatList
            style={{marginBottom: 20}}
            horizontal={true}
            scrollEnabled={false}
            data={menuCategories}
            renderItem={({item}) => 
              <Pressable onPress={() => {handleCategoryPress(item)}} style={[styles.pill, selectedCategory === item && styles.selected]}>
                <Text style={styles.pillText}>
                  {item}
                </Text>
              </Pressable>
            }
            keyExtractor={item => item}
          />
        }


        {data && 
        <FlatList
          scrollEnabled={false}
          style={{width: '100%'}}
          data={data}
          renderItem={({item}) => <Item title={item.name} price={item.price} image={item.image} description={item.description} />}
          keyExtractor={item => item.id}
        />}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: '#495e57',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  mainBody: {
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  welcomeText: {
    fontFamily: 'MarkaziText',
    color: "#f4ce14",
    fontSize: 48,
  },
  welcomeImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  welcomeSubtext: {
    fontFamily: 'MarkaziText',
    color: "#ffffff",
    fontSize: 30,
  },
  welcomeBody: {
    fontFamily: 'Karla',
    color: "#ffffff",
    fontSize: 16,
    marginTop: 14,
  },
  welcomeWrapper: {
    flexDirection: 'row',
    gap: 20,
    maxWidth: '100%',
    justifyContent: 'space-between',
  },
  h2: {
    fontFamily: 'Karla',
    fontSize: 20, 
    marginBottom: 20
  },
  h3: {
    fontFamily: 'Karla',
    fontSize: 18, 
    marginBottom: 16
  },
  description: {
    color: '#555',
    marginBottom: 12,
    fontFamily: 'Karla'
  },
  price: {
    color: '#495e57',
    fontSize: 16,
    fontFamily: 'Karla'

  },
  menuListItem: {
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    gap: 12
  },
  menuListImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  pill: {
    backgroundColor: '#edefee',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#edefee',
  },
  selected: {
    borderColor: '#495e57',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2c4753',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 40,
    borderRadius: 6,
    width: 250,
    marginTop: 20,
    width: '100%',
  },
  searchIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10, 
    marginTop: -30,
    marginLeft: 10,
    height: 22,
    width: 22
  }
});
