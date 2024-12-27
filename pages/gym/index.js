import { Row, Select, Col } from 'antd'
import React from 'react'

function Gym() {
    const [selectedExercise, setSelectedExercise] = React.useState(1);

    const exercises = {
        1: [
            "https://www.youtube.com/embed/JSDpq14vCZ8?si=GvQhmgsE0bVNjd29",
            "https://www.youtube.com/embed/UCXxvVItLoM?si=CuqjoMZTKA96R8Kd",
            "https://www.youtube.com/embed/eGjt4lk6g34?si=yjl1_ALktAP-9wa6",
            "https://www.youtube.com/embed/JGeRYIZdojU?si=PaWAjakUrzagKdrE",
            "https://www.youtube.com/embed/0Po47vvj9g4?si=JWAYyTGHxTnEf53Z",
            "https://www.youtube.com/embed/-xa-6cQaZKY?si=qsFBP2N8m9_GsIbU",
            "https://www.youtube.com/embed/HnHuhf4hEWY?si=hJjWd04ZqiGmF4HZ"
        ],
        // Add more exercises here
    };

    const handleChange = (value) => {
        setSelectedExercise(value);
    };

    return (
        <div>
            <Select options={[{ label: "Full body 1", value: 1 }]} onChange={handleChange} value={selectedExercise}>Choose exercise</Select>

            <Row gutter={[16, 16]}>
                {exercises[selectedExercise]?.map((exercise, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                        <iframe width="100%" height="315" src={exercise} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Gym
