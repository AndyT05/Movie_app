import { Client, TablesDB, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

// export const updateSearchCount = async () => {
//   const client = new Client()
//     .setEndpoint("https://nyc.cloud.appwrite.io/v1")
//     .setProject(PROJECT_ID);

//   try {
//     const tablesDB = new TablesDB(client);
//     const response = await tablesDB.createRow(
//       DATABASE_ID,
//       TABLE_ID,
//       ID.unique(),
//       {
//         searchTern: "test_search_term",
//       }
//     );
//     console.log("Row created:", response);
//     return response;
//   } catch (error) {
//     console.error("Error creating row:", error);
//     throw error; // rethrow so caller can handle
//   }
// };

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
  try {
    console.log(`Search Term is: ${searchTerm}`);
    const result = await database.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    console.log("result is: ", result);

    // 2. If it does, update the count
    if (result.rows.length > 0) {
      const row = result.rows[0];

      await database.updateRow(DATABASE_ID, TABLE_ID, row.$id, {
        count: row.count + 1,
      });
      // 3. If it doesn't, create a new document with the search term and count as 1
    } else {
      await database.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listRows(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
