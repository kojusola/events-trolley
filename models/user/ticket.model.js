const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

const ticketModel = mongoose.Schema(
  {
    vendorId: String,
    ticketImage: {
      type: Object,
      avatar: {
        type: String,
      },
      cloundinaryId: {
        type: String,
      },
    },
    slugEventName: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    eventVenue: {
      type: String,
      required: true,
      min: 3,
    },
    venueAddress: {
      type: String,
    },
    eventStartDate: {
      type: String,
    },
    eventEndDate: {
      type: String,
    },
    eventTime: {
      type: String,
    },
    ticketSaleStartDate: {
      type: String,
    },
    ticketSaleEndDate: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    category: String,
    categories: [
      {
        ticketName: String,
        description: String,
        numberOfTickets: Number,
        price: {
          type: String,
          default: null,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ticketModel.plugin(mongoosePaginate);

module.exports = mongoose.model("ticket", ticketModel);
