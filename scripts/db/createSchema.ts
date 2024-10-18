import { Databases, ID, Models } from "node-appwrite";
import dotenv from "dotenv";
import { createAdminClient } from "@/lib/server/appwrite";
dotenv.config();

const DB_ID = process.env.DB_ID!;

type AttributeCreator = {
  key: string;
  create: () => Promise<
    Models.AttributeString | Models.AttributeBoolean | Models.AttributeUrl
  >;
};

async function createSchemaAttributes(
  db: Databases,
  collectionName: string,
  attributeCreators: AttributeCreator[]
) {
  const results = await Promise.allSettled(
    attributeCreators.map((attr) => attr.create())
  );

  const errors: string[] = [];

  results.forEach((result, index) => {
    const { key } = attributeCreators[index];
    if (result.status === "fulfilled") {
      console.log(`Successfully created attribute: ${key}`);
    } else {
      const errorMessage = `Failed to create attribute ${key}: ${result.reason}`;
      console.error(errorMessage);
      errors.push(errorMessage);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Failed to create some attributes:\n${errors.join("\n")}`);
  }
}

async function createLandingPageSchema(colId?: string) {
  const { db } = await createAdminClient();
  const collectionID =
    colId || (await db.createCollection(DB_ID, ID.unique(), "landingPage")).$id;

  const attributeCreators: AttributeCreator[] = [
    {
      key: "logo",
      create: () => db.createUrlAttribute(DB_ID, collectionID, "logo", true),
    },
    {
      key: "name",
      create: () =>
        db.createStringAttribute(DB_ID, collectionID, "name", 100, true),
    },
    {
      key: "spaceMessage",
      create: () =>
        db.createStringAttribute(
          DB_ID,
          collectionID,
          "spaceMessage",
          1000,
          true
        ),
    },
    {
      key: "primaryColor",
      create: () =>
        db.createStringAttribute(DB_ID, collectionID, "primaryColor", 20, true),
    },
    {
      key: "questionSection",
      create: () =>
        db.createBooleanAttribute(DB_ID, collectionID, "questionSection", true),
    },
    {
      key: "questions",
      create: () =>
        db.createStringAttribute(
          DB_ID,
          collectionID,
          "questions",
          1000,
          false,
          undefined,
          true
        ),
    },
    {
      key: "buttonText",
      create: () =>
        db.createStringAttribute(DB_ID, collectionID, "buttonText", 40, true),
    },
  ];

  try {
    await createSchemaAttributes(db, "landingPage", attributeCreators);
    console.log(
      `Landing page schema created successfully. Collection ID: ${collectionID}`
    );
    return collectionID;
  } catch (error) {
    console.error("Failed to create landing page schema:", error);
    throw error;
  }
}

async function createSettingsSchema(colId?: string) {
  const { db } = await createAdminClient();
  const collectionID =
    colId || (await db.createCollection(DB_ID, ID.unique(), "settings")).$id;

  const attributeCreators: AttributeCreator[] = [
    {
      key: "ipEnabledReview",
      create: () =>
        db.createBooleanAttribute(
          DB_ID,
          collectionID,
          "ipEnabledReview",
          false
        ),
    },
    {
      key: "authEnabledReview",
      create: () =>
        db.createBooleanAttribute(
          DB_ID,
          collectionID,
          "authEnabledReview",
          false
        ),
    },
    {
      key: "nameRequired",
      create: () =>
        db.createBooleanAttribute(DB_ID, collectionID, "nameRequired", true),
    },
    {
      key: "starRatingRequired",
      create: () =>
        db.createBooleanAttribute(
          DB_ID,
          collectionID,
          "starRatingRequired",
          true
        ),
    },
  ];

  try {
    await createSchemaAttributes(db, "settings", attributeCreators);
    console.log(
      `Settings schema created successfully. Collection ID: ${collectionID}`
    );
    return collectionID;
  } catch (error) {
    console.error("Failed to create settings schema:", error);
    throw error;
  }
}

async function createNotificationSchema(colId?: string) {
  const { db } = await createAdminClient();
  const collectionID =
    colId ||
    (await db.createCollection(DB_ID, ID.unique(), "notification")).$id;

  const attributeCreators: AttributeCreator[] = [
    {
      key: "emailOnFeedback",
      create: () =>
        db.createBooleanAttribute(
          DB_ID,
          collectionID,
          "emailOnFeedback",
          false
        ),
    },
    {
      key: "emailTemplate",
      create: () =>
        db.createStringAttribute(
          DB_ID,
          collectionID,
          "emailTemplate",
          1000,
          true
        ),
    },
  ];

  try {
    await createSchemaAttributes(db, "notification", attributeCreators);
    console.log(
      `Notification schema created successfully. Collection ID: ${collectionID}`
    );
    return collectionID;
  } catch (error) {
    console.error("Failed to create notification schema:", error);
    throw error;
  }
}

async function createThankYouPageSchema(colId?: string) {
  const { db } = await createAdminClient();
  const collectionID =
    colId ||
    (await db.createCollection(DB_ID, ID.unique(), "thankYouPage")).$id;

  const attributeCreators: AttributeCreator[] = [
    {
      key: "title",
      create: () =>
        db.createStringAttribute(
          DB_ID,
          collectionID,
          "title",
          100,
          true
        ),
    },
    {
      key: "message",
      create: () =>
        db.createStringAttribute(
          DB_ID,
          collectionID,
          "message",
          1000,
          true
        ),
    },
  ];

  try {
    await createSchemaAttributes(db, "thankYouPage", attributeCreators);
    console.log(
      `Thank You Page schema created successfully. Collection ID: ${collectionID}`
    );
    return collectionID;
  } catch (error) {
    console.error("Failed to create thank you page schema:", error);
    throw error;
  }
}

await createThankYouPageSchema("6712b036001462701174")
await createNotificationSchema()