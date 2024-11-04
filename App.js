import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const savedTasks = await AsyncStorage.getItem('@tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const saveTasks = async (tasks) => {
    await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
  };

  const addTask = () => {
    if (task.trim()) {
      const newTasks = [...tasks, { text: task, comment: '' }];
      setTasks(newTasks);
      setTask('');
      saveTasks(newTasks);
    }
  };

  const addComment = () => {
    const updatedTasks = [...tasks];
    updatedTasks[selectedTaskIndex].comment = comment;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setModalVisible(false);
    setComment('');
  };

  const deleteComment = () => {
    const updatedTasks = [...tasks];
    updatedTasks[selectedTaskIndex].comment = '';
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const openCommentModal = (index) => {
    setSelectedTaskIndex(index);
    setComment(tasks[index].comment);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Adicione uma tarefa"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Adicionar Tarefa</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.task}>
            <TouchableOpacity onPress={() => openCommentModal(index)}>
              <Text style={styles.taskText}>{item.text}</Text>
              {item.comment ? (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentText}>Comentário: {item.comment}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={deleteComment}>
                    <Text style={styles.deleteButtonText}>Remover Comentário</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Adicionar Comentário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite um comentário"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.button} onPress={addComment}>
            <Text style={styles.buttonText}>Salvar Comentário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  task: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  commentContainer: {
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    marginTop: 5,
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
});
