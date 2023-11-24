import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Heading,
  Button,
  Flex,
  Checkbox,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filterToggle, setFilterToggle] = useState("all");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((res) => {
        setTodo(res.data);
        console.log(res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTodo = {
        id: todo.length + 1,
        title: newTask,
        completed: false,
      };
      setTodo([...todo, newTodo]);
      setNewTask("");
    }
  };

  const deleteTask = (id) => {
    setIsDeleteAlertOpen(true);
    setSelectedTodo({ id });
  };

  const handleDeleteConfirm = () => {
    setTodo(todo.filter((item) => item.id !== selectedTodo.id));
    setIsDeleteAlertOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
    setSelectedTodo(null);
  };

  const openEditModal = (selectedTodo) => {
    setSelectedTodo(selectedTodo);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTodo(null);
  };

  const updateTask = () => {
    const index = todo.findIndex((item) => item.id === selectedTodo.id);

    const updatedTodo = {
      ...selectedTodo,
      title: selectedTodo.title,
    };
    const updatedTodoList = [...todo];
    updatedTodoList[index] = updatedTodo;
    setTodo(updatedTodoList);
    closeEditModal();
  };

  const toggleTaskStatus = (id) => {
    const updatedTodoList = todo.map((item) => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTodo(updatedTodoList);
  };

  const filteredTasks =
    filterToggle === "completed" ? todo.filter((item) => item.completed) : todo;

  return (
    <Box>
      {/* Input Section */}

      <Box w="50%" m="auto" mt="2" textAlign="center">
        <Heading>Todo App</Heading>
        <Flex mt="2">
          <Input
            placeholder="Add to Task List"
            size="md"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button colorScheme="blue" onClick={addTask}>
            Add Todo
          </Button>
        </Flex>
      </Box>

      <Box m="auto" mt="10px">
        <Flex display={"flex"} justifyContent={"center"}>
          <Button
            colorScheme="red"
            onClick={() => {
              setFilterToggle("all");
            }}
          >
            All Tasks
          </Button>
          <Button
            colorScheme="green"
            onClick={() => {
              setFilterToggle("completed");
            }}
          >
            Completed Task
          </Button>
        </Flex>
      </Box>

      {/* Todo List */}

      {filteredTasks.map((elem) => {
        return (
          <Box key={elem.id} h="40px" w="40%" m="auto" mt="5">
            <Flex
              fontSize="20px"
              textAlign="left"
              border="2px"
              borderColor="gray.500"
              justifyContent="space-between"
            >
              <Checkbox
                isChecked={elem.completed}
                onChange={() => toggleTaskStatus(elem.id)}
                marginLeft={"20px"}
              >
                {elem.title}
              </Checkbox>
              <Flex>
                <Icon
                  h="40px"
                  w="30px"
                  as={RiEdit2Fill}
                  cursor="pointer"
                  onClick={() => openEditModal(elem)}
                />
                <Icon
                  h="40px"
                  w="30px"
                  ml={"5px"}
                  as={MdDelete}
                  cursor={"pointer"}
                  onClick={() => deleteTask(elem.id)}
                />
              </Flex>
            </Flex>
          </Box>
        );
      })}
      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Input field for editing task */}
            <Input
              placeholder="Edit Task"
              value={selectedTodo?.title || ""}
              onChange={(e) =>
                setSelectedTodo({ ...selectedTodo, title: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateTask}>
              Save
            </Button>
            <Button onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={handleDeleteCancel}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this task?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  );
};

export default Todo;
