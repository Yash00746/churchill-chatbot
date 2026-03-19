
export function parseMessage(req, res, next) {
    try {
      const { text } = req.body || {};
  
      
      req.originalText = text;
  
      
      req.normalized = text.trim().toLowerCase();
  
      
      req.tokens = req.normalized.split(/\s+/);
  
      next();
    } catch (err) {
      next(err);
    }
  }
  