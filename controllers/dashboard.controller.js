const BookingDetailModel = require("../services/bookingdetail.service");
const ProductService = require("../services/product.service");

exports.getDashboard = async (req, res) => {
  let data = {};
  const overview = await BookingDetailModel.getOverview();
  const statisticStatus = await BookingDetailModel.statisticStatus();
  let listService = await BookingDetailModel.getTop10Services();
  data.overview = overview[0];
  data.statisticStatus = statisticStatus;
  listService = await Promise.all(
    listService.map(async (item) => {
      const service = await ProductService.findByID(item.service);
      service.dataValues.count = item.dataValues.serviceCount;
      return service;
    })
  );
  data.listService = listService;

  return res.status(200).json({
    data,
    status: true,
  });
};
