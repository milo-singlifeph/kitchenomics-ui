import React, { useContext, useState } from "react";
import MyContext from "../MyContext/MyContext";
import { Navigate, Routes, Route } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import RecipeList from "../components/RecipeList/RecipeList";
import RecipeIngredients from "../components/RecipeIngredients/RecipeIngredients";
import NoResult from "../components/NoResult";
import LoadingSpinner from "../components/LoadingSpinner";
import CarouselComponent from "../components/CarouselComponent/CarouselComponent";
import Favorites from "../components/Favorites/Favorites";

const HomePage = () => {
  const { isLoggedIn, searchKeyword, recipeId } = useContext(MyContext);

  const [recipes, setRecipes] = useState(
    localStorage.getItem("recipes")
      ? JSON.parse(localStorage.getItem("recipes"))
      : []
  );
  const [pages, setPages] = useState(
    localStorage.getItem("pages")
      ? JSON.parse(localStorage.getItem("pages"))
      : []
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage")
      ? JSON.parse(localStorage.getItem("currentPage"))
      : 0
  );
  const [spinner, setSpinner] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to={"/signin"} replace={true} />;
  }

  const showSpinner = () => setSpinner(true);
  const hideSpinner = () => setSpinner(false);

  return (
    <>
      <NavigationBar
        setRecipes={setRecipes}
        setPages={setPages}
        setCurrentPage={setCurrentPage}
        showSpinner={showSpinner}
        hideSpinner={hideSpinner}
      />
      <Routes>
        <Route path="/" element={<CarouselComponent />} />
        <Route
          path={`/${searchKeyword}`}
          element={
            <RecipeList
              recipes={recipes}
              pages={pages}
              currentPage={currentPage}
              setRecipes={setRecipes}
              setPages={setPages}
              setCurrentPage={setCurrentPage}
            />
          }
        />
        <Route
          path={`/${recipeId}`}
          element={<RecipeIngredients searchKeyword={searchKeyword} />}
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/no-result" element={<NoResult />} />
      </Routes>
      <LoadingSpinner spinner={spinner} hideSpinner={hideSpinner} />
    </>
  );
};

export default HomePage;
