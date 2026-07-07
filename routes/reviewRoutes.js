router.post(
    "/:productId",
    customerMiddleware,
    addReview
);

router.patch(
    "/:productId/:reviewId",
    customerMiddleware,
    editReview
);

router.delete(
    "/:productId/:reviewId",
    customerMiddleware,
    deleteReview
);

router.get(
    "/mine/:productId",
    customerMiddleware,
    getMyReview
);

router.get(
    "/product/:productId",
    getProductReviews
);

router.get(
    "/home",
    getHomeReviews
);