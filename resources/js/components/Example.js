import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';

export default class Example extends Component {

    constructor(){
        super()
        this.state = {
            tasks: [],
            newTaskModal: false,
            newTaskData: {
                name: "",
                description: ""
            },
            editTaskModal: false,
            editTaskData: {
                name: "",
                description: ""
            }
        }
    }

    loadTask(){
        axios.get('http://localhost:8000/api/tasks').then((response) => {
            this.setState({
                tasks: response.data,
            })
        });
    }

    addTask(){
        axios.post('http://localhost:8000/api/task', this.state.newTaskData).then((response) => {

            let { tasks } = this.state
            this.loadTask()

            this.setState({
                tasks,
                newTaskModal: false,
                newTaskData: {
                    name: "",
                    description: ""
                },
            })
        });
    }

    // invoked from inside the table edit button
    editTask(id, name, description){
        this.setState({
            editTaskData: {
                id,
                name,
                description
            },
            editTaskModal: !this.state.editTaskModal
        })
    }

    updateTask(){
        let {taskId, name, description} = this.state.editTaskData
        axios.put('http://localhost:8000/api/task/'+this.state.editTaskData.id, {
            name,
            description
        }).then((response) => {
            this.loadTask();
            this.setState({
                editTaskModal: false,
                editTaskData: {
                    id: "",
                    name: "",
                    description: ""
                }
            })

        })
    }

    // invoke delete task from delete button from the tasks table
    deleteTask(id){
        axios.delete('http://localhost:8000/api/task/'+id).then((response) => {
            this.loadTask()
        })
    }

    componentWillMount(){
        this.loadTask();
    }

    //invoke open modal to add a new task

    toggleNewTaskModal(){
        this.setState({
            newTaskModal: !this.state.newTaskModal,
        })
    }

    toggleEditTaskModal(){
        this.setState({
            editTaskModal: !this.state.editTaskModal,
        })
    }

    render(){

        let tasks = this.state.tasks.map((task) => {
            return(
                <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>
                        <Button 
                        color="success" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => this.editTask(task.id, task.name, task.description)}
                        >Edit</Button>

                        <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => {this.deleteTask(task.id)}}
                        >Delete</Button>
                    </td>
                </tr>
            )
        });

        return (
            <div className="container">

                {/* add task modal */}
                <Button className="my-3" color="primary" onClick={this.toggleNewTaskModal.bind(this)}>Add a new task</Button>
                <Modal isOpen={this.state.newTaskModal} toggle={this.toggleNewTaskModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewTaskModal.bind(this)}>Task Manager</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input id="name"
                                   value={this.state.newTaskData.name}
                                   onChange={(e) => {
                                        let { newTaskData } = this.state
                                        newTaskData.name = e.target.value
                                        this.setState({newTaskData})
                                   }}
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input id="description"
                                   value={this.state.newTaskData.description}
                                   onChange={(e) => {
                                        let { newTaskData } = this.state
                                        newTaskData.description = e.target.value
                                        this.setState({newTaskData})
                                   }}
                            ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.addTask.bind(this)}>Add Task</Button>{' '}
                    <Button color="secondary" onClick={this.toggleNewTaskModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* edit task modal */}
                <Modal isOpen={this.state.editTaskModal} toggle={this.toggleEditTaskModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditTaskModal.bind(this)}>Task Manager</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input id="name"
                                   value={this.state.editTaskData.name}
                                   onChange={(e) => {
                                        let { editTaskData } = this.state
                                        editTaskData.name = e.target.value
                                        this.setState({editTaskData})
                                   }}
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input id="description"
                                   value={this.state.editTaskData.description}
                                   onChange={(e) => {
                                        let { editTaskData } = this.state
                                        editTaskData.description = e.target.value
                                        this.setState({editTaskData})
                                   }}
                            ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.updateTask.bind(this)}>Edit Task</Button>{' '}
                    <Button color="secondary" onClick={this.toggleEditTaskModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <table className="table my-4 pt-5">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                        {tasks}
                      
                    </tbody>
                </table>
            </div>
        );
    }
}

// export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
