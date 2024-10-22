import { Button, Form } from 'react-bootstrap';
import './UpdateUser.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: ""
    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/employee/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error("Failed to fetch employee data");
                }
            } catch (error) {
                console.error("Error fetching user", error.message);
            }
        };
        fetchEmployee();
    }, [id]);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/employee/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log("Employee updated successfully!");
                navigate('/');
            } else {
                console.error("Failed to update employee");
            }
        } catch (error) {
            console.error("Error updating employee", error.message);
        }
    };

    return (
        <div className="center-form">
            <h2>Edit Employee</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name || ""} 
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email || ""} 
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone || ""} 
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDepartment">
                    <Form.Control
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        value={formData.department || ""}  // Ensure value is always a string
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Edit Employee
                </Button>
            </Form>
        </div>
    );
};

export default UpdateUser;
