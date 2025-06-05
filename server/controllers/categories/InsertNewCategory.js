import pool from '../../db.js';

export const InsertnewCat= async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    const { newCategoryName, newDescription } = (req.body);
    console.log("creating new category")

    // Validation: Ensure inputs are not empty
    if (!newCategoryName || !newDescription) {
        return res.status(400).json({ error: "Category name and description are required." });
    }

    try {
        // Insert new category into database
        const result = await pool.query(
            "INSERT INTO category_preferences (user_id, category_name, category_description) VALUES ($1, $2, $3) RETURNING id, category_name AS name, category_description AS title;",
            [userId, newCategoryName, newDescription]
        );
        await pool.query(
            `UPDATE users 
             SET update = $1 
             WHERE id = $2;`,
            [1, userId]
        );

        res.status(201).json(result.rows[0]); // Return newly created category
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}