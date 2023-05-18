const router = require("express").Router();
const {
	find,
	findById,
	insert,
	update,
	remove,
	findPostComments,
	findCommentById,
	insertComment,
} = require("./posts-model");

router.get("/", async (req, res) => {
	try {
		const post = await find();
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ message: "Gönderiler alınamadı" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const post = await findById(req.params.id);
		if (!post) {
			res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
		} else {
			res.json(post);
		}
	} catch {
		res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { title, contents } = req.body;
		if (!contents || !title) {
			res.status(400).json({
				message: "Lütfen gönderi için bir title ve contents sağlayın",
			});
		} else {
			const newId = await insert({ title, contents });
			const newComment = await findById(newId.id);
			res.status(201).json(newComment);
		}
	} catch (e) {
		res
			.status(500)
			.json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const post = await findById(req.params.id);
		const { title, contents } = req.body;
		if (!post) {
			res
				.status(404)
				.json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
		} else {
			if (!title || !contents) {
				res
					.status(400)
					.json({ message: "Lütfen gönderi için title ve contents sağlayın" });
			} else {
				await update(req.params.id, { title, contents });
				const updatedPost = await findById(req.params.id);
				res.json(updatedPost);
			}
		}
	} catch (e) {
		res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const post = await findById(req.params.id);

		if (!post) {
			res
				.status(404)
				.json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
		} else {
			await remove(req.params.id);
			res.status(200).json(post);
		}
	} catch (e) {
		res.status(500).json({ message: "Gönderi silinemedi" });
	}
});

router.get("/:id/comments", async (req, res) => {
	try {
		const post = await findById(req.params.id);
		if (!post) {
			res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
		} else {
			const postsComments = await findPostComments(req.params.id);
			res.json(postsComments);
		}
	} catch (error) {
		res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
	}
});

module.exports = router;
