import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { debounce } from 'lodash'; 

export default function Home() {

  const [data, setData] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedKeywordSearch = debounce(async () => {
    await keywordSearch();
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
    debouncedKeywordSearch(searchTerm);
  }, [searchTerm]);

  const keywordSearch = async () => {
    if (searchTerm == "" && selectedCategory == null) {
      return checkAndFetchData();
    } else if (searchTerm == "" && selectedCategory != null) {
      return handleCategoryPress(selectedCategory, false);
    }
  
    const db = SQLite.openDatabase('little_lemon.db');Gr
  
    if (searchTerm != '') {
      try {
        const data = await new Promise((resolve, reject) => {
          db.transaction(
            (tx) => {
              let query = `SELECT * FROM menu WHERE name LIKE ?`;
              let params = [`%${searchTerm}%`];
  
              if (selectedCategory != null) {
                query += ` AND category == ?`;
                params.push(selectedCategory);
              }
  
              tx.executeSql(
                query,
                params,
                (_, results) => {
                  const rows = results.rows;
                  if (rows.length > 0) {
                    const data = rows._array;
                    setData(data);
                    resolve(data);
                  } else {
                    resolve([]);
                  }
                }
              );
            },
            (error) => {
              reject(error);
            }
          );
        });
  
        return data;
      } catch (error) {
        console.error('Error in keywordSearch:', error);
        throw error;
      }
    }
  };

  const checkAndFetchData = async () => {
    const db = SQLite.openDatabase('little_lemon.db');
  
    try {
      const data = await new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM menu',
              [],
              (_, results) => {
                const rows = results.rows;
                if (rows.length > 0) {
                  const data = rows._array;
                  setData(data);
                  resolve(data);
                } else {
                  fetchDataAndStoreInDatabase()
                    .then((data) => {
                      resolve(data);
                    })
                    .catch((fetchError) => {
                      reject(fetchError);
                    });
                }
              },
              (error) => {
                reject(error);
                fetchDataAndStoreInDatabase();
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
      });
  
      return data;
    } catch (error) {
      console.error('Error in checkAndFetchData:', error);
      throw error;
    }
  };


  const handleCategoryPress = async (category, reset=true) => {
    setSearchTerm('');
    if (category == selectedCategory && reset) {
      setSelectedCategory(null);
      return checkAndFetchData();
    } else {
      setSelectedCategory(category);
    }
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
                    const data = rows._array; 
                    setData(data);
                    resolve(data);
                  } else {
                    resolve([]); 
                  }
                },
                (error) => {
                  reject(error);
                }
              );
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          resolve([]);
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
      storeDataInDatabase(jsonData.menu);
    } catch (error) {
      Promise.reject(error);
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
                dataToStore.forEach((item, index) => {
                  tx.executeSql(
                    'INSERT INTO menu (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)',
                    [index, item.name, item.price, item.description, item.image, item.category],
                    (_, results) => {
                    },
                    (error) => {
                      reject(error);
                    }
                  );
                });
              },
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          },
          () => {
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
      {/* *****  Header Section is implemented via Stack Navigation Header Options ***** */}
      {/* *****  Hero Section  ***** */}
      <View style={styles.hero}>
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
          <TextInput style={styles.input} onChangeText={setSearchTerm} value={searchTerm} />
          <SearchIcon/>
      </View>
      
      {/* *****  Menu Breakdown  ***** */}
      <View style={styles.menuBreakdown}>
        <Text style={styles.h2}>ORDER FOR DELIVERY</Text>

        {menuCategories &&
            
          <FlatList
            style={{marginBottom: 20}}
            horizontal={true}
            scrollEnabled={false}
            data={menuCategories}
            renderItem={({item}) => 
              <Pressable onPress={() => {handleCategoryPress(item)}} style={[styles.pill, selectedCategory == item && styles.selected]}>
                <Text style={styles.pillText}>
                  {item}
                </Text>
              </Pressable>
            }
            keyExtractor={item => item}
          />
        }

        {/* *****  Food Menu List  ***** */}
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
  hero: {
    backgroundColor: '#495e57',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  menuBreakdown: {
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
