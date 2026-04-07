const { Role } = require("../../config/constant.config")
const loginCheck = require("../../middleware/auth.middlewares")
const hasPermission = require("../../middleware/rbac.middlewares")
const { bodyValidator } = require("../../middleware/validator.middlewares")
const inquiryController = require("./inquiry.controller")
const { createInquiryDTO, updateInquiryStatusDTO } = require("./inquiry.request")

const router = require("express").Router()

// ── Public + optional-auth ────────────────────────────────────────────────────
// POST /inquiries  — anyone can submit; userId injected if logged in
// We use a lightweight optional-auth: loginCheck is NOT required here.
// The controller reads req.authUser?.id safely.
router.post(
    "/",
    bodyValidator(createInquiryDTO),
    inquiryController.create
)

// ── Authenticated user ────────────────────────────────────────────────────────
// GET /inquiries/my  — logged-in user sees only their own
router.get(
    "/my",
    loginCheck,
    inquiryController.myInquiries
)

// ── Admin only ────────────────────────────────────────────────────────────────
// GET    /inquiries          
router.get(
    "/",
    loginCheck,
    hasPermission([Role.ADMIN]),
    inquiryController.index
)

// GET    /inquiries/:id      — single inquiry detail
// DELETE /inquiries/:id      — hard delete
router.route("/:id")
    .get(loginCheck,    hasPermission([Role.ADMIN]), inquiryController.showById)
    .delete(loginCheck, hasPermission([Role.ADMIN]), inquiryController.delete)

// PATCH  /inquiries/:id/status — update status only
router.patch(
    "/:id/status",
    loginCheck,
    hasPermission([Role.ADMIN]),
    bodyValidator(updateInquiryStatusDTO),
    inquiryController.updateStatus
)

module.exports = router
