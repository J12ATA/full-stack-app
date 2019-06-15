const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");

// Load input validation
const validateAddAdminInput = require("./validation/add_admin");
const validateLoginInput = require("./validation/login");
const validateAddReviewerInput = require("./validation/add_reviewer");
const validateAddProductInput = require("./validation/add_product");
const validateAddProductReviewInput = require("./validation/add_product_review");

// Load Admin model
const Admin = require("./models/Admin");

// Load Reviewer model
const Reviewer = require("./models/Reviewer");

// Load Product model
const Product = require("./models/Product");

// @route POST api/add_product_review
// @desc AddProductReview review
// @access Public
router.post("/add_product_review", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddProductReviewInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Reviewer.findOne({ name: req.body.name }).then(reviewer => {
    if (!reviewer) {
      return res.status(400).json({ name: "Reviewer does not yet exist" });
    } else {
      if (reviewer.reviews.length !== 0) {
        const regEx = new RegExp(`^${req.body.product}$`, "i");

        let priorReview = reviewer.reviews.map(review => {
          if (review.product.match(regEx)) return 1;
        });

        if (priorReview.find(i => i === 1) !== undefined) {
          return res
            .status(400)
            .json({ error: "Max of one review per product" });
        }
      }

      Product.findOne({ name: req.body.product }).then(product => {
        if (!product) {
          return res
            .status(400)
            .json({ product: "Product does not yet exist" });
        } else {
          const dateString = new Date().toDateString();

          product.reviews.push({
            rating: req.body.rating,
            date: dateString,
            author: reviewer.name,
            description: req.body.description,
            verified: reviewer.verified,
            approved: false
          });

          product.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

          let ratings = [];

          product.reviews.map(review =>
            ratings.push([Number(review.rating), Number(review.rating)])
          );

          const weightedMean = arr => {
            let totalWeight = arr.reduce((acc, curr) => {
              return acc + curr[1];
            }, 0);

            return arr.reduce((acc, curr) => {
              return acc + (curr[0] * curr[1]) / totalWeight;
            }, 0);
          };

          product.rating = weightedMean(ratings).toFixed(1);

          product.save();

          reviewer.reviews.push({
            date: dateString,
            product: product.name,
            rating: req.body.rating,
            description: req.body.description,
            verified: reviewer.verified,
            approved: false
          });

          reviewer.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

          let newlyAddedReview = reviewer.reviews
            .map(review => {
              if (review.description === req.body.description) {
                return review;
              } else {
                return 1;
              }
            })
            .find(element => element !== 1);

          reviewer
            .save()
            .then(reviewer =>
              res.json({
                date: newlyAddedReview.date,
                product: newlyAddedReview.product,
                rating: newlyAddedReview.rating,
                description: newlyAddedReview.description,
                approved: "Review is awaiting approval"
              })
            )
            .catch(err => console.log(err));
        }
      });
    }
  });
});

// @route POST api/add_product
// @desc AddProduct product
// @access Public
router.post("/add_product", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddProductInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Product.findOne({ name: req.body.name }).then(product => {
    if (product) {
      return res.status(400).json({ name: "Product already exists" });
    } else {
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
      });

      newProduct
        .save()
        .then(product =>
          res.json({
            name: product.name,
            price: product.price,
            description: product.description
          })
        )
        .catch(err => console.log(err));
    }
  });
});

// @route POST api/add_admin
// @desc AddAdmin admin
// @access Public
router.post("/add_admin", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddAdminInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          newAdmin.password = hash;
          newAdmin
            .save()
            .then(admin =>
              res.json({
                name: admin.name,
                email: admin.email
              })
            )
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/add_reviewer
// @desc AddReviewer reviewer
// @access Public
router.post("/add_reviewer", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddReviewerInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Reviewer.findOne({ email: req.body.email }).then(reviewer => {
    if (reviewer) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newReviewer = new Reviewer({
        name: req.body.name,
        email: req.body.email,
        verified: req.body.verified,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newReviewer.password, salt, (err, hash) => {
          if (err) throw err;
          newReviewer.password = hash;
          newReviewer
            .save()
            .then(reviewer =>
              res.json({
                name: reviewer.name,
                email: reviewer.email
              })
            )
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/login_admin
// @desc LoginAdmin admin and return JWT token
// @access Public
router.post("/login_admin", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find admin by email
  Admin.findOne({ email }).then(admin => {
    // Check if admin exists
    if (!admin) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, admin.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: admin.id,
          name: admin.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST api/login_reviewer
// @desc LoginReviewer reviewer and return JWT token
// @access Public
router.post("/login_reviewer", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find reviewer by email
  Reviewer.findOne({ email }).then(reviewer => {
    // Check if reviewer exists
    if (!reviewer) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, reviewer.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: reviewer.id,
          name: reviewer.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route GET api/get_reviewers
router.get("/get_reviewers", (req, res) => {
  // Find all Reviewers
  Reviewer.find({}, "name verified reviews -_id")
    .then(reviewers => {
      if (reviewers.length === 0)
        return res.send("No reviewers yet in database.");

      let reviewersToDisplay = [];

      reviewers.map(reviewer => {
        if (reviewer.reviews.length !== 0) {
          reviewer.reviews = reviewer.reviews.filter(review => {
            if (review.approved === true) {
              delete review.approved;
              return review;
            } else {
              delete review.author;
              delete review.date;
              delete review.product;
              delete review.rating;
              delete review.description;
              delete review.verified;
              delete review.approved;
              return (review.status = "Review awaiting approval");
            }
          });
        } else {
          reviewer.reviews = "No reviews yet in database";
        }
        reviewersToDisplay.push(reviewer);
      });

      res.json(reviewersToDisplay);
    })
    .catch(err => console.log(err));
});

// @route GET api/get_products
router.get("/get_products", (req, res) => {
  // Find all Products
  Product.find({}, "-_id -__v")
    .then(products => {
      if (products.length === 0)
        return res.send("No products yet in database.");

      let productsToDisplay = [];

      const weightedMean = arr => {
        let totalWeight = arr.reduce((acc, curr) => {
          return acc + curr[1];
        }, 0);

        return arr.reduce((acc, curr) => {
          return acc + (curr[0] * curr[1]) / totalWeight;
        }, 0);
      };

      products.map(product => {
        if (product.reviews.length !== 0) {
          product.reviews = product.reviews.filter(review => {
            if (review.approved === true) {
              delete review.approved;
              return review;
            } else {
              delete review.author;
              delete review.date;
              delete review.product;
              delete review.rating;
              delete review.description;
              delete review.verified;
              delete review.approved;
              return (review.status = "Review awaiting approval");
            }
          });

          let ratings = [];

          product.reviews.map(review => {
            if (!review.status) {
              ratings.push([Number(review.rating), Number(review.rating)]);
            }
          });

          product.rating = weightedMean(ratings).toFixed(1);
        } else {
          product.reviews = "No reviews yet in database";
        }

        productsToDisplay.push(product);
      });

      res.json(productsToDisplay);
    })
    .catch(err => console.log(err));
});

// @route PUT api/update_reviewer/:name
router.put("/update_reviewer/:name", (req, res) => {
  const { new_name, new_email, new_password, is_verified } = req.body;
  Reviewer.findOne({ name: req.params.name })
    .then(reviewer => {
      if (!reviewer) {
        return res
          .status(400)
          .json({ error: `${req.params.name} is not a registered reviewer` });
      } else {
        if (new_name) {
          reviewer.name = new_name;
          if (reviewer.reviews !== 0) {
            Product.find({})
              .then(products => {
                products.map(product => {
                  if (product.reviews.length !== 0) {
                    product.reviews = product.reviews.map(review => {
                      if (review.author === req.params.name) {
                        return {
                          rating: review.rating,
                          date: review.date,
                          author: new_name,
                          description: review.description,
                          verified: review.verified,
                          approved: review.approved
                        };
                      } else {
                        return review;
                      }
                    });
                    product.save();
                  }
                });
              })
              .catch(err => console.log(err));
          }
        }
        if (new_email) {
          reviewer.email = new_email;
        }
        if (is_verified) {
          reviewer.verified = is_verified === "true" ? true : false;
          if (reviewer.reviews !== 0) {
            reviewer.reviews = reviewer.reviews.map(review => {
              return {
                date: review.date,
                product: review.product,
                rating: review.rating,
                description: review.description,
                verified: is_verified === "true" ? true : false,
                approved: review.approved
              };
            });
            Product.find({})
              .then(products => {
                products.map(product => {
                  if (product.reviews.length !== 0) {
                    product.reviews = product.reviews.map(review => {
                      if (
                        review.author === new_name ||
                        review.author === req.params.name
                      ) {
                        return {
                          rating: review.rating,
                          date: review.date,
                          author: review.author,
                          description: review.description,
                          verified: is_verified === "true" ? true : false,
                          approved: review.approved
                        };
                      } else {
                        return review;
                      }
                    });
                    product.save();
                  }
                });
              })
              .catch(err => console.log(err));
          }
        }

        if (
          new_password &&
          new_password.length > 6 &&
          new_password.length < 30
        ) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(new_password, salt, (err, hash) => {
              if (err) throw err;
              reviewer.password = hash;
              reviewer.save();
            });
          });
        }
      }
      reviewer
        .save()
        .then(reviewer =>
          res.json({ status: `Reviewer ${reviewer.name} successfully updated` })
        )
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @route PUT api/update_product/:name
router.put("/update_product/:name", (req, res) => {
  const { new_name, new_price, new_description } = req.body;
  Product.findOne({ name: req.params.name })
    .then(product => {
      if (!product) {
        return res
          .status(400)
          .json({ error: `${req.params.name} is not a registered product` });
      } else {
        if (new_name) {
          product.name = new_name;
          Reviewer.find({})
            .then(reviewers => {
              reviewers.map(reviewer => {
                if (reviewer.reviews.length !== 0) {
                  reviewer.reviews = reviewer.reviews.map(review => {
                    if (review.product === req.params.name) {
                      return {
                        date: review.date,
                        product: new_name,
                        rating: review.rating,
                        description: review.description,
                        verified: review.verified,
                        approved: review.approved
                      };
                    } else {
                      return review;
                    }
                  });
                  reviewer.save();
                }
              });
            })
            .catch(err => console.log(err));
        }
        if (new_price) {
          product.price = new_price;
        }
        if (new_description) {
          product.description = new_description;
        }
      }
      product
        .save()
        .then(product =>
          res.json({ status: `Product ${product.name} successfully updated` })
        )
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @route PUT api/update_product_review/:name
router.put("/update_product_review/:name", (req, res) => {
  const { new_rating, new_description, is_approved, reviewer_name } = req.body;
  Product.findOne({ name: req.params.name })
    .then(product => {
      if (!product) {
        return res
          .status(400)
          .json({ error: `${req.params.name} is not a registered product` });
      } else {
        if (new_rating) {
          if (product.reviews.length !== 0) {
            product.reviews = product.reviews.map(review => {
              if (review.author === reviewer_name) {
                return {
                  rating: new_rating,
                  date: review.date,
                  author: review.author,
                  description: review.description,
                  verified: review.verified,
                  approved: review.approved
                };
              } else {
                return review;
              }
            });

            let ratings = [];

            product.reviews.map(review =>
              ratings.push([Number(review.rating), Number(review.rating)])
            );

            const weightedMean = arr => {
              let totalWeight = arr.reduce((acc, curr) => {
                return acc + curr[1];
              }, 0);

              return arr.reduce((acc, curr) => {
                return acc + (curr[0] * curr[1]) / totalWeight;
              }, 0);
            };

            product.rating = weightedMean(ratings).toFixed(1);

            Reviewer.findOne({ name: reviewer_name })
              .then(reviewer => {
                if (!reviewer) {
                  return res.status(400).json({
                    error: `${reviewer_name} is not a registered reviewer`
                  });
                } else {
                  reviewer.reviews = reviewer.reviews.map(review => {
                    if (review.product === req.params.name) {
                      return {
                        date: review.date,
                        product: review.product,
                        rating: new_rating,
                        description: review.description,
                        verified: review.verified,
                        approved: review.approved
                      };
                    } else {
                      return review;
                    }
                  });
                  reviewer.save();
                }
              })
              .catch(err => console.log(err));
          }
        }
        if (new_description) {
          product.reviews = product.reviews.map(review => {
            if (!review) {
              return res
                .status(400)
                .json({ error: `${req.params.name} has no reviews to update` });
            } else {
              if (review.author === reviewer_name) {
                return {
                  rating: review.rating,
                  date: review.date,
                  author: review.author,
                  description: new_description,
                  verified: review.verified,
                  approved: review.approved
                };
              } else {
                return review;
              }
            }
          });
          Reviewer.findOne({ name: reviewer_name })
            .then(reviewer => {
              if (!reviewer) {
                return res.status(400).json({
                  error: `${reviewer_name} is not a registered reviewer`
                });
              } else {
                reviewer.reviews = reviewer.reviews.map(review => {
                  if (review.product === req.params.name) {
                    return {
                      date: review.date,
                      product: review.product,
                      rating: review.rating,
                      description: new_description,
                      verified: review.verified,
                      approved: review.approved
                    };
                  } else {
                    return review;
                  }
                });
                reviewer.save();
              }
            })
            .catch(err => console.log(err));
        }
        if (is_approved) {
          product.reviews = product.reviews.map(review => {
            if (!review) {
              return res
                .status(400)
                .json({ error: `${req.params.name} has no reviews to update` });
            } else {
              if (review.author === reviewer_name) {
                return {
                  rating: review.rating,
                  date: review.date,
                  author: review.author,
                  description: review.description,
                  verified: review.verified,
                  approved: is_approved === "true" ? true : false
                };
              } else {
                return review;
              }
            }
          });
          Reviewer.findOne({ name: reviewer_name })
            .then(reviewer => {
              if (!reviewer) {
                return res.status(400).json({
                  error: `${reviewer_name} is not a registered reviewer`
                });
              } else {
                reviewer.reviews = reviewer.reviews.map(review => {
                  if (review.product === req.params.name) {
                    return {
                      date: review.date,
                      product: review.product,
                      rating: review.rating,
                      description: review.description,
                      verified: review.verified,
                      approved: is_approved === "true" ? true : false
                    };
                  } else {
                    return review;
                  }
                });
                reviewer.save();
              }
            })
            .catch(err => console.log(err));
        }
        product
          .save()
          .then(product =>
            res.json({
              status: `Product review for ${
                product.name
              } by ${reviewer_name} successfully updated`
            })
          )
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

// @route DELETE api/delete_reviewer/:name
router.delete("/delete_reviewer/:name", (req, res) => {
  Reviewer.findOneAndDelete({ name: req.params.name })
    .then(reviewer => {
      if (!reviewer) {
        res.json({
          status: `Reviewer ${req.params.name} not found in database`
        });
      } else {
        if (reviewer.reviews.length !== 0) {
          Product.find({})
            .then(products => {
              products.map(product => {
                if (product.reviews.length !== 0) {
                  product.reviews = product.reviews.map(review => {
                    if (review.author !== req.params.name) {
                      return review;
                    }
                  });

                  let ratings = [];

                  product.reviews.map(review =>
                    ratings.push([Number(review.rating), Number(review.rating)])
                  );

                  const weightedMean = arr => {
                    let totalWeight = arr.reduce((acc, curr) => {
                      return acc + curr[1];
                    }, 0);

                    return arr.reduce((acc, curr) => {
                      return acc + (curr[0] * curr[1]) / totalWeight;
                    }, 0);
                  };

                  product.rating = weightedMean(ratings).toFixed(1);

                  product.save();
                }
              });
            })
            .catch(err => console.log(err));
        }
        res.json({
          success: `Reviewer ${req.params.name} has been successfully deleted`
        });
      }
    })
    .catch(err => console.log(err));
});

// @route DELETE api/delete_product/:name
router.delete("/delete_product/:name", (req, res) => {
  Product.findOneAndDelete({ name: req.params.name })
    .then(product => {
      if (product.reviews.length !== 0) {
        Reviewer.find({})
          .then(reviewers => {
            reviewers.map(reviewer => {
              if (reviewer.reviews.length !== 0) {
                reviewer.reviews = reviewer.reviews.map(review => {
                  if (review.product === req.params.name) {
                    return {
                      date: review.date,
                      product: `UNAVAILABLE - ${review.product}`,
                      rating: review.rating,
                      description: review.description,
                      verified: review.verified,
                      approved: review.approved
                    };
                  } else {
                    return review;
                  }
                });
              }
            });
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

// @route DELETE api/delete_product_review/:name
router.delete("/delete_product_review/:name", (req, res) => {
  Reviewer.findOne({ name: req.params.name })
    .then(reviewer => {
      if (!reviewer) {
        res
          .status(400)
          .json({ error: `${req.params.name} is not a registered reviewer` });
      } else {
        if (reviewer.reviews.length !== 0) {
          reviewer.reviews = reviewer.reviews.map(review => {
            if (review.product !== req.body.product) {
              return review;
            }
          });

          reviewer.save();

          Product.findOne({ name: req.body.product })
            .then(product => {
              product.reviews = product.reviews.map(review => {
                if (review.author !== req.params.name) {
                  return review;
                }
              });

              let ratings = [];

              product.reviews.map(review =>
                ratings.push([Number(review.rating), Number(review.rating)])
              );

              const weightedMean = arr => {
                let totalWeight = arr.reduce((acc, curr) => {
                  return acc + curr[1];
                }, 0);

                return arr.reduce((acc, curr) => {
                  return acc + (curr[0] * curr[1]) / totalWeight;
                }, 0);
              };

              product.rating = weightedMean(ratings).toFixed(1);

              product.save();
            })
            .catch(err => console.log(err));
        } else {
          return res.status(400).json({
            error: `${req.params.name} has not submited a review for product ${
              req.body.product
            }, nothing to delete`
          });
        }
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
