const inquiryService = require("./inquiry.service")

class InquiryController {

    /**
     * POST /inquiries
     * Public + authenticated.
     * If the caller is logged in, userId is attached automatically.
     */
    create = async (req, res, next) => {
        try {
            const userId = req.authUser?.id ?? null   // null for guests
            const response = await inquiryService.create({
                ...req.body,
                userId,
            })
            res.status(201).json({
                result:  response,
                message: "Inquiry submitted successfully",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    /**
     * GET /inquiries
     * Admin only — paginated list with optional filters.
     * Query params: page, limit, propertyId, status, email, search
     */
    index = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10
            const page  = parseInt(req.query.page,  10) || 1
            const skip  = (page - 1) * limit

            const filters = {
                propertyId: req.query.propertyId,
                status:     req.query.status,
                email:      req.query.email,
                search:     req.query.search,
            }

            const { data, count } = await inquiryService.index(filters, limit, skip)

            res.json({
                result:  data,
                message: "Inquiries fetched successfully",
                meta: {
                    currentPage: page,
                    total:       count,
                    limit,
                    totalPages:  Math.ceil(count / limit),
                },
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    /**
     * GET /inquiries/my
     * Authenticated user — see only their own inquiries.
     */
    myInquiries = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10
            const page  = parseInt(req.query.page,  10) || 1
            const skip  = (page - 1) * limit

            const { data, count } = await inquiryService.myInquiries(req.authUser.id, limit, skip)

            res.json({
                result:  data,
                message: "Your inquiries fetched successfully",
                meta: {
                    currentPage: page,
                    total:       count,
                    limit,
                    totalPages:  Math.ceil(count / limit),
                },
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    /**
     * GET /inquiries/:id
     * Admin only.
     */
    showById = async (req, res, next) => {
        try {
            const inquiry = await inquiryService.getById(req.params.id)
            res.json({
                result:  inquiry,
                message: "Inquiry fetched successfully",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    /**
     * PATCH /inquiries/:id/status
     * Admin only — update status (NEW | IN_PROGRESS | CLOSED).
     */
    updateStatus = async (req, res, next) => {
        try {
            const response = await inquiryService.updateStatus(req.params.id, req.body.status)
            res.json({
                result:  response,
                message: "Inquiry status updated",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    /**
     * DELETE /inquiries/:id
     * Admin only.
     */
    delete = async (req, res, next) => {
        try {
            await inquiryService.delete(req.params.id)
            res.json({
                result:  null,
                message: "Inquiry deleted successfully",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}

module.exports = new InquiryController()
