// routes/offers.js
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');
const { filterProductForCatalog, validateProductContent } = require('../utils/productContentValidation');

const router = express.Router();

// SINGLE AGGREGATION PIPELINE - This is the key optimization!
router.get('/:offerType/products', asyncHandler(async (req, res) => {
  const db = getDb();
  const offerType = req.params.offerType;
  
  // Validate offer type
  const validOfferTypes = ['direct_discount', 'coupon', 'free_product', 'bundle_discount'];
  if (!validOfferTypes.includes(offerType)) {
    return res.status(400).json({
      error: 'Invalid offer type',
      message: `Offer type must be one of: ${validOfferTypes.join(', ')}`
    });
  }

  // Pagination parameters
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;
  const currentDate = new Date();

  // SINGLE AGGREGATION PIPELINE THAT DOES EVERYTHING AT ONCE
  const pipeline = [
    {
      $match: {
        $and: [
          { "status.isActive": true },
          { "status.isHidden": { $ne: true } },
          { "availability.isAvailable": true },
          {
            $expr: {
              $or: [
                // Check main offers
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$offers", []] },
                          as: "offer",
                          cond: {
                            $and: [
                              {
                                $or: [
                                  { $eq: ["$$offer.offer_type", offerType] },
                                  { $eq: ["$$offer.type", offerType] }
                                ]
                              },
                              { $eq: ["$$offer.is_active", true] },
                              {
                                $or: [
                                  { $lte: ["$$offer.start", currentDate] },
                                  { $eq: ["$$offer.start", null] },
                                  { $not: ["$$offer.start"] }
                                ]
                              },
                              {
                                $or: [
                                  { $gte: ["$$offer.end", currentDate] },
                                  { $eq: ["$$offer.end", null] },
                                  { $not: ["$$offer.end"] }
                                ]
                              }
                            ]
                          }
                        }
                      }
                    },
                    0
                  ]
                },
                // Check color variants
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$colorVariants", []] },
                          as: "variant",
                          cond: {
                            $gt: [
                              {
                                $size: {
                                  $filter: {
                                    input: { $ifNull: ["$$variant.offers", []] },
                                    as: "offer",
                                    cond: {
                                      $and: [
                                        {
                                          $or: [
                                            { $eq: ["$$offer.offer_type", offerType] },
                                            { $eq: ["$$offer.type", offerType] }
                                          ]
                                        },
                                        { $eq: ["$$offer.is_active", true] },
                                        {
                                          $or: [
                                            { $lte: ["$$offer.start", currentDate] },
                                            { $eq: ["$$offer.start", null] },
                                            { $not: ["$$offer.start"] }
                                          ]
                                        },
                                        {
                                          $or: [
                                            { $gte: ["$$offer.end", currentDate] },
                                            { $eq: ["$$offer.end", null] },
                                            { $not: ["$$offer.end"] }
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                }
                              },
                              0
                            ]
                          }
                        }
                      }
                    },
                    0
                  ]
                },
                // Check charge options
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$chargeOptions", []] },
                          as: "option",
                          cond: {
                            $gt: [
                              {
                                $size: {
                                  $filter: {
                                    input: { $ifNull: ["$$option.offers", []] },
                                    as: "offer",
                                    cond: {
                                      $and: [
                                        {
                                          $or: [
                                            { $eq: ["$$offer.offer_type", offerType] },
                                            { $eq: ["$$offer.type", offerType] }
                                          ]
                                        },
                                        { $eq: ["$$offer.is_active", true] },
                                        {
                                          $or: [
                                            { $lte: ["$$offer.start", currentDate] },
                                            { $eq: ["$$offer.start", null] },
                                            { $not: ["$$offer.start"] }
                                          ]
                                        },
                                        {
                                          $or: [
                                            { $gte: ["$$offer.end", currentDate] },
                                            { $eq: ["$$offer.end", null] },
                                            { $not: ["$$offer.end"] }
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                }
                              },
                              0
                            ]
                          }
                        }
                      }
                    },
                    0
                  ]
                }
              ]
            }
          }
        ]
      }
    },
    // Add filters
    ...(req.query.search ? [{
      $match: {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { nameAr: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    }] : []),
    ...(req.query.category ? [{
      $match: { cat_code: req.query.category }
    }] : []),
    ...(req.query.brand ? [{
      $match: { brand_code: req.query.brand }
    }] : []),
    // Project only needed fields
    {
      $project: {
        _id: 1,
        stk_code: 1,
        id: 1,
        slug: 1,
        name: 1,
        nameAr: 1,
        description: 1,
        descriptionAr: 1,
        price: 1,
        image: 1,
        images: 1,
        category: 1,
        categoryAr: 1,
        cat_code: 1,
        brand: 1,
        brand_code: 1,
        badge: 1,
        isMostSold: 1,
        isNew: 1,
        isHot: 1,
        offers: {
          $filter: {
            input: { $ifNull: ["$offers", []] },
            as: "offer",
            cond: {
              $and: [
                {
                  $or: [
                    { $eq: ["$$offer.offer_type", offerType] },
                    { $eq: ["$$offer.type", offerType] }
                  ]
                },
                { $eq: ["$$offer.is_active", true] }
              ]
            }
          }
        },
        availability: 1,
        specs: 1,
        colorVariants: {
          $map: {
            input: { $ifNull: ["$colorVariants", []] },
            as: "variant",
            in: {
              stk_code: "$$variant.stk_code",
              price: "$$variant.price",
              color_name: "$$variant.color_name",
              color_name_ar: "$$variant.color_name_ar",
              color_hex: "$$variant.color_hex",
              in_stock: "$$variant.in_stock",
              active: "$$variant.active",
              images: "$$variant.images",
              offers: {
                $filter: {
                  input: { $ifNull: ["$$variant.offers", []] },
                  as: "offer",
                  cond: {
                    $and: [
                      {
                        $or: [
                          { $eq: ["$$offer.offer_type", offerType] },
                          { $eq: ["$$offer.type", offerType] }
                        ]
                      },
                      { $eq: ["$$offer.is_active", true] }
                    ]
                  }
                }
              }
            }
          }
        },
        chargeOptions: {
          $map: {
            input: { $ifNull: ["$chargeOptions", []] },
            as: "option",
            in: {
              stk_code: "$$option.stk_code",
              price: "$$option.price",
              name: "$$option.name",
              name_ar: "$$option.name_ar",
              in_stock: "$$option.in_stock",
              active: "$$option.active",
              offers: {
                $filter: {
                  input: { $ifNull: ["$$option.offers", []] },
                  as: "offer",
                  cond: {
                    $and: [
                      {
                        $or: [
                          { $eq: ["$$offer.offer_type", offerType] },
                          { $eq: ["$$offer.type", offerType] }
                        ]
                      },
                      { $eq: ["$$offer.is_active", true] }
                    ]
                  }
                }
              }
            }
          }
        },
        status: 1,
        updatedAt: 1,
        // Add fields for stats calculation
        allOffers: {
          $concatArrays: [
            { $ifNull: ["$offers", []] },
            {
              $reduce: {
                input: { $ifNull: ["$colorVariants", []] },
                initialValue: [],
                in: { $concatArrays: ["$$value", { $ifNull: ["$$this.offers", []] }] }
              }
            },
            {
              $reduce: {
                input: { $ifNull: ["$chargeOptions", []] },
                initialValue: [],
                in: { $concatArrays: ["$$value", { $ifNull: ["$$this.offers", []] }] }
              }
            }
          ]
        }
      }
    },
    // Keep only products that have at least one matching offer after filtering
    {
      $match: {
        $expr: {
          $or: [
            { $gt: [{ $size: "$offers" }, 0] },
            {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$colorVariants",
                      as: "variant",
                      cond: { $gt: [{ $size: "$$variant.offers" }, 0] }
                    }
                  }
                },
                0
              ]
            },
            {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$chargeOptions",
                      as: "option",
                      cond: { $gt: [{ $size: "$$option.offers" }, 0] }
                    }
                  }
                },
                0
              ]
            }
          ]
        }
      }
    },
    // Calculate max savings in the same pipeline
    {
      $addFields: {
        maxOfferValue: {
          $max: {
            $map: {
              input: "$allOffers",
              as: "offer",
              in: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$$offer.offer_type", offerType] },
                      { $eq: ["$$offer.type", offerType] }
                    ]
                  },
                  {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$$offer.discount_type", "p"] },
                          { $eq: ["$$offer.discountType", "percentage"] }
                        ]
                      },
                      { 
                        value: {
                          $cond: [
                            { $lte: ["$$offer.discount", 1] },
                            { $multiply: ["$$offer.discount", 100] },
                            "$$offer.discount"
                          ]
                        },
                        type: "percentage"
                      },
                      {
                        value: {
                          $cond: [
                            { $gt: ["$$offer.couponValue", 0] },
                            "$$offer.couponValue",
                            { $ifNull: ["$$offer.discount", 0] }
                          ]
                        },
                        type: "value"
                      }
                    ]
                  },
                  null
                ]
              }
            }
          }
        }
      }
    },
    // Sort
    {
      $sort: (() => {
        switch (req.query.sort) {
          case 'price_asc': return { price: 1 };
          case 'price_desc': return { price: -1 };
          case 'name_asc': return { name: 1 };
          case 'name_desc': return { name: -1 };
          default: return { updatedAt: -1 };
        }
      })()
    },
    // Pagination
    {
      $facet: {
        metadata: [
          { $count: "total" }
        ],
        products: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              allOffers: 0 // Remove temporary field
            }
          }
        ],
        maxSavings: [
          {
            $group: {
              _id: null,
              maxPercentage: { $max: "$maxOfferValue.value" },
              maxValue: { $max: "$maxOfferValue.value" }
            }
          },
          {
            $project: {
              _id: 0,
              value: {
                $cond: [
                  { $gt: ["$maxPercentage", 0] },
                  "$maxPercentage",
                  "$maxValue"
                ]
              },
              type: {
                $cond: [
                  { $gt: ["$maxPercentage", 0] },
                  "percentage",
                  "value"
                ]
              }
            }
          }
        ],
        categories: [
          {
            $group: {
              _id: {
                code: "$cat_code",
                name: "$category",
                nameAr: "$categoryAr"
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
          {
            $project: {
              _id: 0,
              code: "$_id.code",
              name: "$_id.name",
              nameAr: "$_id.nameAr",
              count: 1
            }
          }
        ],
        brands: [
          {
            $group: {
              _id: {
                code: "$brand_code",
                name: "$brand"
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
          {
            $project: {
              _id: 0,
              code: "$_id.code",
              name: "$_id.name",
              count: 1
            }
          }
        ]
      }
    }
  ];

  // Execute SINGLE aggregation pipeline
  const results = await db.collection('products').aggregate(pipeline).toArray();
  const result = results[0] || { metadata: [], products: [], maxSavings: [], categories: [], brands: [] };
  
  const total = result.metadata[0]?.total || 0;
  const maxSavings = result.maxSavings[0] || { value: 0, type: 'percentage' };
  const filteredProducts = hydrateCollection('products', result.products || [])
    .map((product) => {
      const validation = validateProductContent(product);
      return validation.isCatalogReady ? filterProductForCatalog(product, validation) : null;
    })
    .filter(Boolean);

  // Prepare response
  const response = {
    products: filteredProducts,
    pagination: {
      total: filteredProducts.length,
      page,
      limit,
      pages: Math.ceil(filteredProducts.length / limit),
      hasMore: false
    },
    maxSavings: {
      value: maxSavings.value || 0,
      type: maxSavings.type || 'percentage'
    },
    filters: {
      categories: result.categories || [],
      brands: result.brands || []
    }
  };

  res.json(response);
}));

// Keep other endpoints but optimize them similarly
router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
  const skip = (page - 1) * limit;
  const now = new Date();

  const pipeline = [
    {
      $match: {
        ...(req.query.active === 'true' ? { is_active: true } : {}),
        ...(req.query.type ? { offer_type: req.query.type } : {}),
        ...(req.query.live === 'true' ? {
          start: { $lte: now },
          end: { $gte: now }
        } : {})
      }
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        items: [
          { $sort: { start: -1 } },
          { $skip: skip },
          { $limit: limit }
        ]
      }
    }
  ];

  const results = await db.collection('offers').aggregate(pipeline).toArray();
  const result = results[0] || { metadata: [], items: [] };
  const total = result.metadata[0]?.total || 0;

  res.json({
    success: true,
    data: hydrateCollection('offers', result.items || []),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
}));

module.exports = router;
