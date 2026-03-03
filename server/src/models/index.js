const ProductModel = require('./ProductModel');
const CategoryModel = require('./CategoryModel');
const BrandModel = require('./BrandModel');
const OfferModel = require('./OfferModel');
const UserModel = require('./UserModel');
const OrderModel = require('./OrderModel');
const CartModel = require('./CartModel');
const ShowroomModel = require('./ShowroomModel');
const NotificationModel = require('./NotificationModel');
const AssetModel = require('./AssetModel');
const WarrantyModel = require('./WarrantyModel');
const MaintenanceTicketModel = require('./MaintenanceTicketModel');
const PaymentTransactionModel = require('./PaymentTransactionModel');
const ServiceRequestModel = require('./ServiceRequestModel');
const AdminActionModel = require('./AdminActionModel');
const ProductRevisionModel = require('./ProductRevisionModel');
const ProductVisibilityEventModel = require('./ProductVisibilityEventModel');
const ReportDailyKPIModel = require('./ReportDailyKPIModel');
const WebEventModel = require('./WebEventModel');
const CartEventModel = require('./CartEventModel');
const NotificationEventModel = require('./NotificationEventModel');
const HomeReadModel = require('./HomeReadModel');
const ProductDetailReadModel = require('./ProductDetailReadModel');
const ProductsReadModel = require('./ProductsReadModel');
const CategoryBrandReadModel = require('./CategoryBrandReadModel');
const OffersReadModel = require('./OffersReadModel');
const ShowroomsReadModel = require('./ShowroomsReadModel');
const FooterReadModel = require('./FooterReadModel');
const SavedSpecTitleModel = require('./SavedSpecTitleModel');
const SiteContentModel = require('./SiteContentModel');

const modelByCollection = {
  products: ProductModel,
  categories: CategoryModel,
  brands: BrandModel,
  offers: OfferModel,
  users: UserModel,
  orders: OrderModel,
  carts: CartModel,
  showrooms: ShowroomModel,
  notifications: NotificationModel,
  assets: AssetModel,
  warranties: WarrantyModel,
  maintenance_tickets: MaintenanceTicketModel,
  payment_transactions: PaymentTransactionModel,
  service_requests: ServiceRequestModel,
  admin_actions: AdminActionModel,
  product_revisions: ProductRevisionModel,
  product_visibility_events: ProductVisibilityEventModel,
  report_daily_kpis: ReportDailyKPIModel,
  web_events: WebEventModel,
  cart_events: CartEventModel,
  notification_events: NotificationEventModel,
  home_read: HomeReadModel,
  product_detail_read: ProductDetailReadModel,
  products_read: ProductsReadModel,
  category_brand_read: CategoryBrandReadModel,
  offers_read: OffersReadModel,
  showrooms_read: ShowroomsReadModel,
  footer_read: FooterReadModel,
  saved_spec_titles: SavedSpecTitleModel,
  site_content: SiteContentModel,
};

function hydrateCollection(collectionName, docs) {
  const Model = modelByCollection[collectionName];
  if (!Model || !Array.isArray(docs)) return docs;
  return docs.map((doc) => Model.fromDocument(doc).toJSON());
}

function hydrateDocument(collectionName, doc) {
  const Model = modelByCollection[collectionName];
  if (!Model || !doc) return doc;
  return Model.fromDocument(doc).toJSON();
}

module.exports = {
  ProductModel,
  CategoryModel,
  BrandModel,
  OfferModel,
  UserModel,
  OrderModel,
  CartModel,
  ShowroomModel,
  NotificationModel,
  AssetModel,
  WarrantyModel,
  MaintenanceTicketModel,
  PaymentTransactionModel,
  ServiceRequestModel,
  AdminActionModel,
  ProductRevisionModel,
  ProductVisibilityEventModel,
  ReportDailyKPIModel,
  WebEventModel,
  CartEventModel,
  NotificationEventModel,
  HomeReadModel,
  ProductDetailReadModel,
  ProductsReadModel,
  CategoryBrandReadModel,
  OffersReadModel,
  ShowroomsReadModel,
  FooterReadModel,
  SavedSpecTitleModel,
  SiteContentModel,
  modelByCollection,
  hydrateCollection,
  hydrateDocument,
};
