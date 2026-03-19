

export function validateBody(req, res, next) {
    const { text } = req.body || {};
  
    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Message text is required"
      });
    }
  
    next();
  }
  