import React from "react";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "./features/Hero";
import TrustBar from "./features/TrustBar";
import ActivitiesGallery from "./features/ActivitiesGallery";
import TourListingPage from "./features/TourListingPage";
import TravellerFeedback from './features/TravellerFeedback';

const Packages = () => {
    return (
        <div>
            <Header />
            <Hero />
            <TrustBar />
            <ActivitiesGallery />
            <TourListingPage />
            <TravellerFeedback />
            <Footer />
        </div>
    );
}

export default Packages;