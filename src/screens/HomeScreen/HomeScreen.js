import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function HomeScreen(props) {

    const [tareaText, setTareaText] = useState('') //variable para crear una tarea
    const [tareas, setTareas] = useState([]) //arregeloo de todas las tareas

    const tareaRef = firebase.firestore().collection('tareas') //defenimos la colleción
    const userID = props.extraData.id //obnetemos el usuario conectado

    useEffect(() => { //traemos todas las tareas de l usuario conectado ordenados por fecha dexc
        tareaRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newTareas = [] //crearmos un arreglo auxiliar
                    querySnapshot.forEach(doc => { //iteramos, extrameros los datos de la bd
                        const tarea = doc.data()
                        tarea.id = doc.id
                        newTareas.push(tarea) //se recoorre cada elemento y se agrega al arrelgo newTareas
                    });
                    setTareas(newTareas) //Modificamos el estado de tareas con el arrelgo newTareas
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => { //funcion para agregar tarea
        if (tareaText && tareaText.length > 0) { //revisamoso que no sea nullo
            const timestamp = firebase.firestore.FieldValue.serverTimestamp(); //nos traemos la fecha y hora del servidor de firestor
            //objeto tarea
            const data = { //decalaramos la sigueinte estructura, que se almacenara en la bd
                texto: tareaText, //texto de la tarea es igual a lo que capturamos
                authorID: userID, //usaurio logeado
                createdAt: timestamp, //la fecha y hora
            };

            tareaRef
                .add(data) // agregamos a tarea el objeto data construido previamente
                .then(_doc => { //es una promesa, si se cumple entonces seguimos
                    setTareaText('') //limipamos la variable, (eesta conectada con el input)
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const renderTarea = ({item, index}) => { //funcion que renderiza cada tarea, recibe dos parametros
        return (//mostramos en un componente texto la tarea (item.texto) 
            <View style={styles.tareaContainer}>
                <Text style={styles.tareaText}> 
                    {item.texto}
                </Text>
            </View>
        )
    }

    return ( //retornamos la vista un textInput que esta conectatdo a tareaText, setTareaText
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Agregar una nueva tarea'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setTareaText(text)}
                    value={tareaText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
            </View>
            { tareas && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={tareas}
                        renderItem={renderTarea}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}
