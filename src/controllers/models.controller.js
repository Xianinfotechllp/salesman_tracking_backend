const collectionModel = require("../models/collections");

async function handleLogCollection(req, res) {
    const { client, salesman, amount, date } = req.body;
    try {
        if (!client || !salesman || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newCollection = new collectionModel({
            client,
            salesman,
            amount,
            date
        });
        await newCollection.save();
        return res.status(201).json({ message: "Collection logged successfully", collection: newCollection });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function handleGetAllCollections(req, res) {
    try {
        const collections = await collectionModel.find();
        return res.status(200).json({ collections });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function handleGetCollectionsBySalesmanId(req, res) {
    const { salesmanId } = req.params;
    try {
        const collections = await collectionModel.find({ salesman: salesmanId });
        return res.status(200).json({ collections });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function handleUpdateCollection(req, res) {
    const { id } = req.params;
    const { client, salesman, amount, date } = req.body;
    try {
        const updatedCollection = await collectionModel.findByIdAndUpdate(
            id,
            { client, salesman, amount, date },
            { new: true }
        );
        if (!updatedCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        return res.status(200).json({ message: "Collection updated successfully", collection: updatedCollection });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function handleDeleteCollection(req, res) {
    const { id } = req.params;
    try {
        const deletedCollection = await collectionModel.findByIdAndDelete(id);
        if (!deletedCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        return res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {
    handleLogCollection,
    handleGetAllCollections,
    handleGetCollectionsBySalesmanId,
    handleUpdateCollection,
    handleDeleteCollection
};