const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/fireguard', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define the schema and model
const inspectionSchema = new mongoose.Schema({
    propertyName: String,
    buildingType: String,
    address: String,
    documents: [String],
    specialInstructions: String,
    inspectionDate: Date,
    inspectionTime: String,
});

const Inspection = mongoose.model('Inspection', inspectionSchema);

// API endpoint to save the inspection request
app.post('/api/inspections', async (req, res) => {
    const { propertyName, buildingType, address, documents, specialInstructions, inspectionDate, inspectionTime } = req.body;

    try {
        const newInspection = new Inspection({
            propertyName,
            buildingType,
            address,
            documents,
            specialInstructions,
            inspectionDate,
            inspectionTime,
        });

        await newInspection.save();
        res.status(201).send({ message: 'Inspection request saved successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving inspection request', error });
    }
});

// API endpoint to retrieve all inspections
app.get('/api/inspections', async (req, res) => {
    try {
        const inspections = await Inspection.find();
        res.status(200).json(inspections);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving inspections', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});