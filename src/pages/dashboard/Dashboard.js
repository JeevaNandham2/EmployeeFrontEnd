import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [employees, setEmployees] = useState([]); // Employee list
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [isSearching, setIsSearching] = useState(false); // Loader
    const [currentPage, setCurrentPage] = useState(0); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [pageSize] = useState(10); // Page size, adjust if needed
    const navigate = useNavigate();

    // Fetch employees on initial load and when the search query or page changes
    useEffect(() => {
        if (searchQuery) {
            fetchEmployeesByName(searchQuery, currentPage, pageSize);
        } else {
            fetchAllEmployees(currentPage, pageSize);
        }
    }, [searchQuery, currentPage, pageSize]);

    // Fetch all employees with pagination
    const fetchAllEmployees = async (page, size) => {
      setIsSearching(true);
      try {
          const response = await fetch(`http://localhost:8080/api/employees?page=${page}&size=${size}`);
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (data && data.content && Array.isArray(data.content)) {
              setEmployees(data.content);
              setTotalPages(data.totalPages);  // Get total pages from backend response
          } else {
              setEmployees([]);
          }
      } catch (error) {
          console.error("Error fetching employees:", error.message);
          alert("Error fetching employee data. Please try again.");
          setEmployees([]);
      } finally {
          setIsSearching(false);
      }
  };
  

    // Fetch employees by name with pagination
    const fetchEmployeesByName = async (name, page, size) => {
        setIsSearching(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/employees/search?name=${name}&page=${page}&size=${size}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data && data.content && Array.isArray(data.content)) {
                setEmployees(data.content);
                setTotalPages(data.totalPages);
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error("Error fetching employees:", error.message);
            alert("Error fetching employee data. Please try again.");
            setEmployees([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle deletion of an employee
    const handleDelete = async (employeeId) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/employee/${employeeId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    if (searchQuery) {
                        fetchEmployeesByName(searchQuery, currentPage, pageSize);
                    } else {
                        fetchAllEmployees(currentPage, pageSize);
                    }
                } else {
                    alert("Failed to delete employee. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting employee:", error.message);
                alert("Error deleting employee. Please try again.");
            }
        }
    };

    // Redirect to update page
    const handleUpdate = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    // Handle page changes for pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1 className="text-center">Employee Details</h1>

                    {/* Search bar */}
                    <Form.Control
                        type="text"
                        placeholder="Enter employee name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-3"
                    />

                    {/* Loading Spinner */}
                    {isSearching && <p>Loading...</p>}

                    {/* Employee table */}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone}</td>
                                        <td>{employee.department}</td>
                                        <td>
                                            <Button
                                                variant="outline-warning"
                                                onClick={() => handleUpdate(employee.id)}
                                            >
                                                Update
                                            </Button>{" "}
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleDelete(employee.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination Component */}
                    <Pagination className="justify-content-center">
                        <Pagination.First
                            onClick={() => handlePageChange(0)}
                            disabled={currentPage === 0}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index === currentPage}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage === totalPages - 1}
                        />
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
