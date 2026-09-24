// Run once from the project root:  node seed.js
// Creates: an admin user, a few categories, and sample upcoming events.
// Safe to run again: it never duplicates the admin or categories,
// and only adds events if there are no upcoming events left.

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Category = require("./models/categoryModel");
const Event = require("./models/eventModel");

dotenv.config();

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "12345678";

// A date N days from today at the given hour
const inDays = (days, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
};

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 1. Admin user
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
        admin = await User.create({
            name: "Admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: "admin"
        });
        console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    } else {
        if (admin.role !== "admin") {
            admin.role = "admin";
            await admin.save();
        }
        console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    }

    // 2. Categories
    const categories = {};
    for (const name of ["Tech", "Music", "Sports", "Workshops"]) {
        categories[name] = (await Category.findOne({ name })) || (await Category.create({ name }));
    }
    console.log("Categories ready: " + Object.keys(categories).join(", "));

    // 3. Events (only if nothing upcoming exists)
    const upcoming = await Event.countDocuments({ date: { $gte: new Date() } });
    if (upcoming > 0) {
        console.log(`Skipped events: ${upcoming} upcoming event(s) already exist`);
    } else {
        const samples = [
            { title: "Hack the Campus", description: "24-hour hackathon with mentors from local startups. Teams of up to four.", date: inDays(12), location: "Main Auditorium", price: 200, totalSeats: 120, category: "Tech" },
            { title: "Open Mic Night", description: "Bring your guitar, your poem or just your voice. Sign up on the day.", date: inDays(5, 18), location: "Amphitheatre", price: 150, totalSeats: 60, category: "Music" },
            { title: "Inter-College Cricket Finals", description: "Watch the final match live from the pavilion.", date: inDays(20, 14), location: "Sports Ground", price: 0, totalSeats: 200, category: "Sports" },
            { title: "AI Workshop for Beginners", description: "Hands-on introduction to machine learning with Python.", date: inDays(9, 11), location: "Seminar Hall 2", price: 100, totalSeats: 40, category: "Workshops" }
        ];

        for (const s of samples) {
            await Event.create({
                title: s.title,
                description: s.description,
                date: s.date,
                location: s.location,
                price: s.price,
                totalSeats: s.totalSeats,
                availableSeats: s.totalSeats,
                category: categories[s.category]._id,
                createdBy: admin._id
            });
        }
        console.log(`Added ${samples.length} sample events`);
    }

    await mongoose.disconnect();
    console.log("Done.");
};

run().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});