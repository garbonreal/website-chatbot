export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    return {
      country: data.address?.country,
      state: data.address?.state,
      city: data.address?.city || data.address?.town || data.address?.village,
      district: data.address?.suburb || data.address?.neighbourhood,
      street: data.address?.road,
      postcode: data.address?.postcode,
      fullAddress: data.display_name,
    };
  } catch (error) {
    console.error("Error getting address:", error);
    throw error;
  }
};

export const getLocationByIP = async () => {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();

    if (data.status === "success") {
      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        method: "IP",
      };
    } else {
      throw new Error("Failed to get location by IP");
    }
  } catch (error) {
    console.error("Error getting location by IP:", error);
    throw error;
  }
};

export const getUserLocationInfo = async () => {
  try {
    console.log("Attempting GPS location...");
    const gpsLocation = await getUserLocation();
    console.log("GPS location obtained:", gpsLocation);

    const addressInfo = await getAddressFromCoords(
      gpsLocation.latitude,
      gpsLocation.longitude
    );

    return {
      method: "GPS",
      accuracy: "high",
      coordinates: {
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        accuracy: gpsLocation.accuracy,
      },
      address: addressInfo,
    };
  } catch (gpsError) {
    console.log("GPS location failed, trying IP location:", gpsError.message);

    try {
      const ipLocation = await getLocationByIP();
      console.log("IP location obtained:", ipLocation);

      return {
        method: "IP",
        accuracy: "low",
        coordinates: {
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
        },
        address: {
          country: ipLocation.country,
          state: ipLocation.region,
          city: ipLocation.city,
          timezone: ipLocation.timezone,
        },
      };
    } catch (ipError) {
      console.error("Both GPS and IP location failed:", ipError);
      throw new Error("Unable to determine user location");
    }
  }
};
