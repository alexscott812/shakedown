const Venue = require("../models/venue");
const { v4: uuidv4 } = require("uuid");
const validateUUIDv4 = require("../utils/validate-uuid-v4");
const createError = require("../utils/create-error");

const getVenues = async (req, res, next) => {
  const sort = req.query.sort || "name"; // Default: 'name'
  const sortField = sort.substring(0, 1) === "-" ? sort.substring(1) : sort;
  const sortOrder = sort.substring(0, 1) === "-" ? -1 : 1;
  const sortQuery = { [sortField]: sortOrder };
  const page = Math.max(parseInt(req.query.page) || 1, 1); // Default: 1, Min: 1
  const limit = Math.min(parseInt(req.query.limit) || 12, 1000); // Default: 12, Max: 1000
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.q) query.name = { $regex: req.query.q, $options: "i" };

  try {
    const venues = await Venue.aggregate([
      { $match: query },
      { $sort: sortQuery },
      {
        $facet: {
          meta: [
            { $count: "total_results" },
            {
              $addFields: {
                current_page: page,
                results_limit: limit,
                total_pages: {
                  $ceil: {
                    $divide: ["$total_results", limit],
                  },
                },
              },
            },
          ],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $project: {
          data: "$data",
          meta: {
            $ifNull: [
              { $arrayElemAt: ["$meta", 0] },
              {
                total_results: 0,
                current_page: page,
                results_limit: limit,
                total_pages: 0,
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(venues[0]);
  } catch (err) {
    return next(createError(500, err.message));
  }
};

const getVenueById = async (req, res, next) => {
  try {
    if (!validateUUIDv4(req.params.id)) {
      return next(createError(404, "Invalid venue ID"));
    }
    const venue = await Venue.aggregate([
      { $match: { _id: req.params.id } },
      {
        $lookup: {
          from: "shows",
          localField: "_id",
          foreignField: "venue._id",
          as: "shows",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          show_count: {
            $size: "$shows",
          },
        },
      },
    ]);
    if (!venue[0]) {
      return next(
        createError(404, `No venue found with ID of ${req.params.id}`)
      );
    }
    res.status(200).json(venue[0]);
  } catch (err) {
    return next(createError(500, err.message));
  }
};

const addVenue = async (req, res, next) => {
  try {
    const venue = new Venue({
      _id: validateUUIDv4(req.body._id) ? req.body._id : uuidv4(),
      name: req.body.name,
    });

    const newVenue = await venue.save();
    res.status(201).json(newVenue);
  } catch (err) {
    return next(createError(400, err.message));
  }
};

const updateVenueById = async (req, res, next) => {
  try {
    if (!validateUUIDv4(req.params.id)) {
      return next(createError(404, "Invalid venue ID"));
    }
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!venue) {
      return next(
        createError(404, `No venue found with ID of ${req.params.id}`)
      );
    }
    res.status(200).json(venue);
  } catch (err) {
    return next(createError(500, err.message));
  }
};

const deleteVenues = async (req, res, next) => {
  try {
    const result = await Venue.deleteMany({});
    res.status(200).json({ msg: `Deleted ${result.deletedCount} venues` });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

const deleteVenueById = async (req, res, next) => {
  try {
    if (!validateUUIDv4(req.params.id)) {
      return next(createError(404, "Invalid venue ID"));
    }
    const venue = await Venue.findOneAndDelete({ _id: req.params.id });
    if (!venue) {
      return next(
        createError(404, `No venue found with ID of ${req.params.id}`)
      );
    }
    res.status(200).json({ msg: `Deleted venue with ID of ${req.params.id}` });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

module.exports = {
  getVenues,
  getVenueById,
  addVenue,
  updateVenueById,
  deleteVenues,
  deleteVenueById,
};
