import { BaseModel } from ".";
import { Db, Filter, ObjectId, SortDirection } from "mongodb";
import connectDB from "@/server/database";
import {
  ParsePaginateAndQueryProp,
  parsePaginateAndQuery,
} from "@/utils/paginate";
import { escapeRegExp } from "@/utils/escape";
import { AdminStatus } from "@/utils/var";

export interface Admin extends BaseModel {
  fullName: string;
  email: string;
  password: string;
  status: AdminStatus | string;
}

export const adminCollection = (db: Db) => db.collection<Admin>("admin");

// find by id
export const findAdminById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await adminCollection(m).findOne({ _id: id });
  return result;
};

// find by email
export const findAdminByEmail = async (email: string) => {
  const m = await connectDB();
  const result = await adminCollection(m).findOne({ email: email });
  return result;
};

// get all users
export const getAllAdmin = async (
  countOnly = false,
  q: ParsePaginateAndQueryProp
) => {
  const filter: Filter<Admin> = {};
  const { query, limit, skip, sort_by, sort } = parsePaginateAndQuery(q);

  if (typeof query !== "undefined" && query !== "") {
    const searchTerm = query.trim(); // Trim to remove leading and trailing spaces

    if (searchTerm !== "") {
      filter["$or"] = [
        {
          $or: [
            {
              email: {
                $regex: escapeRegExp(searchTerm),
                $options: "i",
              },
            },
            {
              fullName: {
                $regex: escapeRegExp(searchTerm),
                $options: "i",
              },
            },
          ],
        },
      ];
    } else {
      delete filter["$or"]; // Remove $or if search term is empty
    }
  }

  // sort by default _modified : -1
  var sortField = "_id";
  if (sort_by) {
    sortField = escapeRegExp(sort_by);
  }

  var sortValue: SortDirection = -1;
  if (sort) {
    sortValue = sort;
  }

  const m = await connectDB();

  if (countOnly) {
    return adminCollection(m).countDocuments(filter);
  }

  const result = await adminCollection(m)
    .find(filter)
    .sort({ [sortField]: sortValue })
    .limit(Number(limit))
    .skip(skip)
    .toArray();

  const total = await adminCollection(m).countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return {
    data: result,
    pagination: {
      totalRecords: total,
      totalPages,
      current: Math.ceil((skip + 1) / limit),
      perPage: limit,
      recordsOnPage: result.length,
    },
  };
};

// create
export const createAdmin = async (data: Admin) => {
  const m = await connectDB();
  const result = await adminCollection(m).insertOne(data);
  return result;
};

// update
export const updateAdmin = async (data: Admin) => {
  const m = await connectDB();
  const result = await adminCollection(m).updateOne(
    {
      _id: data._id,
    },
    { $set: data }
  );
  return result;
};

// delete admin
export const deleteAdminById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await adminCollection(m).deleteOne({ _id: id });
  return result;
};
