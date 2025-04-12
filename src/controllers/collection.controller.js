const {
  createCollection,
  getAllCollections,
  getCollectionsBySalesmanId,
  updateCollection,
  deleteCollection,
  getCollectionById,
} = require("../services/collection.services");

const handleAddCollection = async (req, res) => {
  try {
    const newCollection = await createCollection(req.body);
    return res.status(201).json({
      message: "Collection added successfully",
      collection: newCollection,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetAllCollections = async (req, res) => {
  try {
    const collections = await getAllCollections();
    return res.status(200).json({ collections });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetCollectionsBySalesmanId = async (req, res) => {
  const salesmanId = req.params.salesmanId;
  try {
    const collections = await getCollectionsBySalesmanId(salesmanId);
    return res.status(200).json({ collections });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetCollectionById = async(req,res)=>{
  const id = req.params.collectionId;
  try {
    const collections = await getCollectionById(id);
    res.status(200).json({collections})
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}
const handleUpdateCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCollection = await updateCollection(id, req.body);
    return res.status(200).json({
      message: "Collection updated successfully",
      collection: updatedCollection,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleDeleteCollection = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCollection(id);
    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  handleAddCollection,
  handleGetAllCollections,
  handleGetCollectionsBySalesmanId,
  handleGetCollectionById,
  handleUpdateCollection,
  handleDeleteCollection,
};
