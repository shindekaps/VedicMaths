// Schema Validation for MongoDB
// Run this in mongosh to enforce schema

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "role"],
      properties: {
        email: { bsonType: "string" },
        username: { bsonType: "string" },
        role: { enum: ["student", "teacher", "admin"] },
        grade: { bsonType: "int" }
      }
    }
  }
});

db.createCollection("sutras", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug", "order_index"],
      properties: {
        name: { bsonType: "string" },
        slug: { bsonType: "string" },
        order_index: { bsonType: "int" }
      }
    }
  }
});

db.createCollection("practice_sessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "sutra_id", "completed_at"],
      properties: {
        user_id: { bsonType: "objectId" },
        sutra_id: { bsonType: "objectId" },
        score: { bsonType: "int" }
      }
    }
  }
});
