import { Accordion, AccordionBody, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// const Module = (props) => {
//     //map lesson
//     return (
//         <Accordion.Item eventKey="0">
//             <Accordion.Header>{props.module}</Accordion.Header>
//             <AccordionBody>
//                 <ListGroup>
//                     <ListGroup.Item>Lesson 1</ListGroup.Item>
//                     <ListGroup.Item>Lesson 1</ListGroup.Item>
//                     <ListGroup.Item>Lesson 1</ListGroup.Item>
//                 </ListGroup>
//             </AccordionBody>
//         </Accordion.Item>
//     )
// }

// const Lesson = (props) => {
//     return(
//         <ListGroup.Item>{props.lesson}</ListGroup.Item>
//     )
// }

const Modules = () => {
    const navigate = useNavigate();
    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Module 1</Accordion.Header>
                <AccordionBody>
                    <ListGroup>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                    </ListGroup>
                </AccordionBody>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>Module 2</Accordion.Header>
                <AccordionBody>
                    <ListGroup>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                        <ListGroup.Item>Lesson 1</ListGroup.Item>
                    </ListGroup>
                </AccordionBody>
            </Accordion.Item>
        </Accordion>
    )
}

export default Modules;