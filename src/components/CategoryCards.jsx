import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import col1 from '../assets/collection/col1.webp'
import col2 from '../assets/collection/col2.webp'
import col3 from '../assets/collection/col3.webp'
import col4 from '../assets/collection/col4.webp'
import col5 from '../assets/collection/col5.webp'
import col6 from '../assets/collection/col6.webp'


 const categories = [
    {
      id: 1,
      title: "Nightwear",
      discount: "UPTO 60% OFF",
      image: col1,
        
      link: "/nightwear",
    },
    {
      id: 2,
      title: "Shapewear",
      discount: "MIN 30% OFF",
      image: col2,
      link: "/shapewear",
    },
    {
      id: 3,
      title: "Activewear",
      discount: "UPTO 60% OFF",
      image:col3,
      link: "/activewear",
    },
    {
      id: 4,
      title: "Panties",
      discount: "UPTO 60% OFF",
      image:col4,
      link: "/panties",
    },
    {
      id: 5,
      title: "Bras",
      discount: "UPTO 60% OFF",
      image:col5,
      link: "/bras",
    },
    {
      id: 6,
      title: "Curvy",
      discount: "UPTO 60% OFF",
      image:col6,
      link: "/bras",
    },
     ];


const CategoryCards = () => {
 
const navigate = useNavigate();

const handleRedirect = () => {
    navigate("/shop");
};

  return (
    <Container className="py-5">
<h1
  className="text-center mb-4"
  style={{
    fontSize: "4vw", // Responsive font size
    fontFamily: "italic", // Clean sans-serif font
    fontWeight: "bold",  // Make the font bold
    color: "#152052ff",  // Dark color to make it stand out
  }}
>
  The game with our new additions!
</h1>      
<Row >
        {categories && categories.map((category) => (
          <Col key={category.id} md={4} sm={6} xs={12} className="mb-4">
            <Card className="category-card position-relative" onClick={handleRedirect} style={{ cursor: "pointer" }}>
              <Card.Img variant="top" src={category.image} />
              <Card.Body className="text-center">
                <h5>{category.title}</h5>
                <p className="text-white">{category.discount}</p>
                </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryCards;
