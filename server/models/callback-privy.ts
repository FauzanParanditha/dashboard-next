import { Db, Filter, SortDirection } from "mongodb";
import { BaseModel } from ".";
import connectDB from "../database";
import { escapeRegExp } from "@/utils/escape";
import {
  ParsePaginateAndQueryProp,
  parsePaginateAndQuery,
} from "@/utils/paginate";

export interface Privy extends BaseModel {
  reference_number: string;
  channel_id: string;
  info: string;
  register_token: string;
  status: string;
  privy_id: string;
  email: string;
  phone: string;
  identity: {
    nama: string;
    nik: string;
    tanggalLahir: string;
  };
}

export const privyCollection = (db: Db) => db.collection<Privy>("privy");

export const getAllPrivy = async (
  countOnly = false,
  q: ParsePaginateAndQueryProp
) => {
  const filter: Filter<Privy> = {};
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
    return privyCollection(m).countDocuments(filter);
  }

  const result = await privyCollection(m)
    .find(filter)
    .sort({ [sortField]: sortValue })
    .limit(Number(limit))
    .skip(skip)
    .toArray();

  const total = await privyCollection(m).countDocuments(filter);
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

export const createCallback = async (data: Privy) => {
  const m = await connectDB();
  const result = await privyCollection(m).insertOne(data);
  return result;
};
