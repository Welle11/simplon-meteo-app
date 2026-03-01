import { useState, useEffect } from "react";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import styles from "../styles/Home.module.css";

export const App = () => {
  const [weatherData, setWeatherData] = useState();
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        setWeatherData({ ...data });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    // Chargement initial
    getData();

    // Timer pour rafraîchir toutes les heures
    // 3600000 ms = 60 minutes = 1 heure
    const intervalId = setInterval(() => {
      getData();
    }, 3600000);

    // Nettoyage : arrête le timer quand le composant est démonté
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const changeSystem = () =>
    unitSystem === "metric"
      ? setUnitSystem("imperial")
      : setUnitSystem("metric");

  const hasError = weatherData?.message;
  const isLoaded = weatherData && !hasError;

  // CAS 1 : Données chargées
  if (isLoaded) {
    return (
      <div className={styles.wrapper}>
        <MainCard
          city={weatherData.name || "Ville inconnue"}
          country={weatherData.sys?.country || "FR"}
          description={
            weatherData.weather?.[0]?.description || "Données actuelles"
          }
          iconName={weatherData.weather?.[0]?.icon || "01d"}
          unitSystem={unitSystem}
          weatherData={weatherData}
        />
        <ContentBox>
          <Header>
            <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
          </Header>
          <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
          <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
        </ContentBox>
      </div>
    );
  }

  // CAS 2 : Erreur
  if (hasError) {
    return (
      <ErrorScreen errorMessage="Impossible de récupérer la météo"></ErrorScreen>
    );
  }

  // CAS 3 : Chargement en cours ⏳
  return <LoadingScreen loadingMessage="Chargement des données..." />;
};

export default App;
