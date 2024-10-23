import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, List } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditModal = ({ visible, onCancel, onOk, movie, fetchData, existingGenres }) => {
    const [form] = Form.useForm();
    const [actors, setActors] = useState([]);
    const [newActor, setNewActor] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');

    useEffect(() => {
        if (movie) {
            form.setFieldsValue({
                name: movie.name,
                director: movie.director,
                duration: movie.duration,
                price: movie.price,
                country: movie.country,
                studio: movie.studio,
                status: movie.status,
                limit: movie.limit, // Set limit value
                description: movie.description, // Set description value
                genres: movie.genres,
            });
            setActors(movie.actors || []); // Initialize actors if available
            setSelectedGenres(movie.genres || []); // Initialize genres if available
        }
    }, [movie, form]);

    const handleFinish = async (values) => {
        const updatedMovie = {
            ...values,
            actors,
            genres: selectedGenres
        }; // Add actors and selected genres to the submitted values

        try {
            // Call your API to update the movie
            const response = await axios.put(`http://localhost:9999/movie/update/${movie._id}`, updatedMovie);
            if (response.status === 200) {
                message.success('Movie updated successfully!');
                onOk(); // Close the modal after successful update
                fetchData();
            }
        } catch (error) {
            message.error('Failed to update movie. Please try again.');
        }
    };

    const addActor = () => {
        if (newActor) {
            setActors([...actors, newActor]); // Add the new actor to the list
            setNewActor(''); // Reset the new actor input field
        } else {
            message.warning('Please enter an actor name!'); // Warning if the input is empty
        }
    };

    const removeActor = (index) => {
        const updatedActors = actors.filter((_, i) => i !== index); // Remove actor by index
        setActors(updatedActors);
    };

    const addGenre = () => {
        if (newGenre && !selectedGenres.includes(newGenre)) {
            setSelectedGenres([...selectedGenres, newGenre]); // Add the new genre to the list
            setNewGenre(''); // Reset the new genre input field
        } else if (selectedGenres.includes(newGenre)) {
            message.warning('This genre is already added!'); // Warning if genre already exists
        } else {
            message.warning('Please enter a genre!'); // Warning if the input is empty
        }
    };

    const removeGenre = (index) => {
        const updatedGenres = selectedGenres.filter((_, i) => i !== index); // Remove genre by index
        setSelectedGenres(updatedGenres);
    };

    return (
        <Modal
            title="Edit Movie"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the movie name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="director" label="Director" rules={[{ required: true, message: 'Please input the director name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please input the duration!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please input the country!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="studio" label="Studio" rules={[{ required: true, message: 'Please input the studio!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status!' }]}>
                    <Select>
                        <Option value="playing">Playing</Option>
                        <Option value="upcoming">Upcoming</Option>
                        <Option value="not playing">Not Playing</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="limit" label="Limit" rules={[{ required: true, message: 'Please input the limit!' }]}>
                    <Input placeholder="Enter limit (e.g., age restriction)" />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                {/* Genres Selection */}
                <Form.Item label="Select Genres">
                    <Select
                        mode="multiple"
                        placeholder="Select existing genres"
                        value={selectedGenres}
                        onChange={setSelectedGenres} // Update selected genres
                        style={{ width: '100%', marginBottom: 8 }}
                    >
                        {existingGenres.map((genre) => (
                            <Option key={genre} value={genre}>{genre}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Add New Genre Input Field */}
                <Form.Item label="Add New Genre">
                    <Input
                        value={newGenre}
                        placeholder="Add a new genre"
                        onChange={(e) => setNewGenre(e.target.value)} // Update new genre input
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addGenre} style={{ width: '100%', marginBottom: 8 }}>
                        Add Genre
                    </Button>
                    <List
                        bordered
                        dataSource={selectedGenres}
                        renderItem={(genre, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeGenre(index)}>Remove</Button>]}
                            >
                                {genre}
                            </List.Item>
                        )}
                    />
                </Form.Item>

                {/* Actors List and Input Field */}
                <Form.Item label="Actors">
                    <Input
                        value={newActor}
                        placeholder="Add a new actor"
                        onChange={(e) => setNewActor(e.target.value)} // Update new actor input
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addActor} style={{ width: '100%', marginBottom: 8 }}>
                        Add Actor
                    </Button>
                    <List
                        bordered
                        dataSource={actors}
                        renderItem={(actor, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeActor(index)}>Remove</Button>]}
                            >
                                {actor}
                            </List.Item>
                        )}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
