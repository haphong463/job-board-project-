import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../features/authSlice";
import categoryData from '../../components/global-navbar/category.json';
import "./listSkillAll.css";
import { useTranslation } from "react-i18next";
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
export function ViewAllSkill ()
{
    const [categories, setCategories] = useState([]);
    const { t, i18n } = useTranslation(); // Initialize the useTranslation hook
    const user = useSelector((state) => state.auth.user);
    const roles = useSelector((state) => state.auth.roles);
    const dispatch = useDispatch();

    const handleLogout = () =>
    {
        dispatch(logout());
    };

    useEffect(() =>
    {
        fetchCategories();
    }, []);

    const fetchCategories = async () =>
    {
        try
        {
            //const response = await axiosRequest.get("/categories");
            setCategories(categoryData);
        } catch (error)
        {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCategoryClick = (categoryId) =>
    {
        window.location.href = `/jobList/${categoryId}`;
    };
    return (

        <GlobalLayoutUser>
            <>
                <section
                    className="section-hero overlay inner-page bg-image"
                    style={{
                        backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
                    }}
                    id="home-section"
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Job By Skill</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="jb_category-grid">
                    {categories.map((category) => (
                        <div key={category.categoryId} className="jb_category-item">
                            <NavLink to={''} className="jb_item" onClick={() => handleCategoryClick(category.categoryId)}>
                                {category.categoryName}
                            </NavLink>
                        </div>
                    ))}
                </div>
            </>
        </GlobalLayoutUser>
    );
}
