const School = require("../models/School");

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input fields." });
  }

  try {
    const school = new School({ name, address, latitude, longitude });
    await school.save();
    res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: school,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      message: "Latitude and Longitude are required.",
    });
  }

  try {
    const schools = await School.find({});
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const sortedSchools = schools
      .map((school) => {
        const distance = getDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        );
        return { ...school._doc, distance: parseFloat(distance.toFixed(2)) };
      })
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: "All Schools Data",
      schools: sortedSchools,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};
