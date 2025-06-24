
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import commentsModel from "../modules/comments.js";
 import path from "path";
import fs from "fs";
const picturesDir = path.join(process.cwd(), 'pictures_of_comments');

const commentsController = {
  getAll: async (req, res) => {


  try {
    const comments = await commentsModel.getAll() || [];

    const commentsWithImage = comments.map(comment => {
      const id = comment.Id;
      const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

      let imageUrl = null;

      for (const ext of possibleExtensions) {
        const imagePath = path.join(picturesDir, `${id}${ext}`);
        if (fs.existsSync(imagePath)) {
          imageUrl = `/comment-images/${id}${ext}`;
          break;
        }
      }

      return {
        ...comment,
        imageUrl  // null אם לא קיימת תמונה
      };
    });

    res.json(commentsWithImage);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
},

  getById: async (req, res) => {
    try {
      const comment = await commentsModel.getById(req.params.commentId);
      if (!comment) return res.status(404).json({ message: 'comment not found' });
      res.json(comment);
    } catch (err) {
      console.error('Error getting comment by ID:', err);
      res.status(500).json({ error: 'Failed to fetch comment' });
    }
  },
  getAllByBookId: async (req, res) => {
    const bookId = req.params.bookId; 
    try {
      const comment = await commentsModel.getAllByBookId(bookId);
      if (!comment) return res.status(404).json({ message: 'comment not found' });
      res.json(comment);
    } catch (err) {
      console.error('Error getting comment by ID:', err);
      res.status(500).json({ error: 'Failed to fetch comment' });
    }
  },


add: async (req, res) => {
  console.log("📁 PDF file:", req.files?.commentFile?.[0]);
  console.log("🖼️ Image file:", req.files?.commentImage?.[0]);
  console.log("📝 Body:", req.body);

  const pdfFile = req.files?.commentFile?.[0];
  const imageFile = req.files?.commentImage?.[0];

  if (!pdfFile) {
    return res.status(400).json({ error: "PDF file is required" });
  }

  // המשך כמו קודם:
  const result = await commentsModel.add({
    ...req.body,
    Seller_Id: req.user.id,
  });

  const commentId = result.commentId;

  // שמירת PDF
  const newPdfPath = path.join(process.cwd(), 'comments_storage', `${commentId}.pdf`);
  fs.renameSync(pdfFile.path, newPdfPath);

  // שמירת תמונה (אם קיימת)
  if (imageFile) {
    const imageExt = path.extname(imageFile.originalname);
    const newImagePath = path.join(process.cwd(), 'pictures_of_comments', `${commentId}${imageExt}`);
    fs.renameSync(imageFile.path, newImagePath);
  }

  res.status(201).json({ message: "comment added successfully", commentId });
},

  update: async (req, res) => {
    const commentId = req.params.commentId;
    const Seller_Id = req.user.id;

    const {
      comment_Name, author, number_Of_Page, Price,
      Category, Note, Status, Editing_Date
    } = req.body;

    const validStatuses = ['offered', 'approved', 'available', 'sold'];
    if (!validStatuses.includes(Status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const user = await usersModel.getById(Seller_Id);
    if (!user) {
      return res.status(400).json({ error: "Seller not found" });
    }

    const previous = await commentsModel.getById(commentId);
    if (!previous) {
      return res.status(404).json({ error: "comment not found" });
    }

    try {
      const updated = await commentsModel.update(commentId, {
        comment_Name: comment_Name || previous.comment_Name,
        author: author || previous.author,
        number_Of_Page: number_Of_Page || previous.number_Of_Page,
        Price: Price || previous.Price,
        Category: Category || previous.Category,
        Note: Note || previous.Note,
        Status: Status || previous.Status,
        Seller_Id: Seller_Id || previous.Seller_Id,
        Editing_Date: Editing_Date || previous.Editing_Date,
      });

      if (!updated) {
        return res.status(404).json({ error: "comment not found to update" });
      }

      res.json({ message: "comment updated successfully" });
    } catch (err) {
      console.error("Error updating comment:", err);
      res.status(500).json({ error: "Failed to update comment" });
    }
  },

  delete: async (req, res) => {
    const commentId = req.params.commentId;

    try {
      const deleted = await commentsModel.delete(commentId);
      if (!deleted) {
        return res.status(404).json({ error: "comment not found to delete" });
      }

      res.json({ message: "comment deleted successfully" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
};

export default commentsController;
