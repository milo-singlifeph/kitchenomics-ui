import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../MyContext/MyContext";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "./RecipeIngredients.css";
import NutrientsList from "../NutrientsList/NutrientsList";
import Ingredients from "./Ingredients";
import LoadingSpinner from "../LoadingSpinner";

const RecipeIngredients = ({ searchKeyword }) => {
  const {
    recipeIngHref,
    setRecipeId,
    setRecipeIngHref,
    removeStorageItems,
  } = useContext(MyContext);

  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeImage, setRecipeImage] = useState("");
  const [nutrients, setNutrients] = useState({});
  const [nutrientsList, setNutrientsList] = useState([]);
  const [numberOfServings, setNumberOfServings] = useState(0);
  const [spinner, setSpinner] = useState(true);

  const hideSpinner = () => setSpinner(false);

  const navigate = useNavigate();

  const backButton = () => {
    removeStorageItems(["recipeId", "recipeIngHref"]);
    setRecipeId("");
    setRecipeIngHref("");

    if (!searchKeyword) {
      navigate("/", { replace: true });
    } else {
      navigate(`/${searchKeyword}`, { replace: true });
    }
  };

  useEffect(() => {
    (async () => {
      const {
        data: { recipe },
      } = await axios(recipeIngHref);
      setRecipeImage(recipe.images.REGULAR.url);
      setRecipeName(recipe.label);
      setRecipeIngredients(recipe.ingredientLines);
      setNutrients(recipe.totalNutrients);
      setNumberOfServings(recipe.yield);
      setNutrientsList(Object.keys(recipe.totalNutrients));
      hideSpinner();
    })();
  }, []);

  return (
    <Container className="my-5 pt-5 recipe-font">
      <Card className="p-4 col-lg-6 mx-auto">
        <Row>
          <Col>
            <Card.Img src={recipeImage} alt={recipeName} />
            <Card.Title className="py-2 mt-2 border-bottom fs-4 recipe-name">
              {recipeName}
            </Card.Title>
            <Card.Subtitle className="py-2 mb-2 border-bottom fs-4 fw-bold">
              {numberOfServings} Servings
            </Card.Subtitle>
            <Card.Subtitle className="py-2 mb-2 border-bottom fs-4 fw-bold">
              {recipeIngredients.length} Ingredients
            </Card.Subtitle>
            <Ingredients ingredients={recipeIngredients} />
          </Col>
          <Col>
            <Card.Subtitle className="py-2 mb-2 border-bottom d-flex justify-content-between">
              <span className="fs-4 fw-bold lh-base">Nutrition</span>
              <Button variant="secondary" size="sm" onClick={backButton}>
                <FaArrowLeft /> Back
              </Button>
            </Card.Subtitle>
            <NutrientsList
              totalNutrients={nutrients}
              nutrientsList={nutrientsList}
              css={"nutrient-list ps-0"}
            />
          </Col>
        </Row>
      </Card>
      <LoadingSpinner spinner={spinner} hideSpinner={hideSpinner} />
    </Container>
  );
};

export default RecipeIngredients;
