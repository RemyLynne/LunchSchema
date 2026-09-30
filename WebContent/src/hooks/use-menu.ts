import type {LunchOption} from "@/models/lunch/lunch-option.ts";
import {useQuery} from "@tanstack/react-query";

export const menuQuery = {
  queryKey: ["menu"],
  queryFn: () => fetchMenu(),
  staleTime: 5 * 60 * 1000,
}

export function useMenu() {
  return useQuery(menuQuery)
}

async function fetchMenu(): Promise<LunchOption[] | null> {
  console.log("fetch")

  return Promise.resolve([
    {
      id: 1,
      name: {
        content: "common_bread",
        translations: {
          en: "Bread",
          no: "Brød"
        }
      },
      currentBilling: {
        price: 30,
        billingPeriod: "day"
      },
      newBilling: {
        price: 40,
        billingPeriod: "day"
      },
      currentAvailableDays: [0,1,2,3,4],
      newAvailableDays: [1,3]
    },
    {
      id: 2,
      name: {
        content: "common_toast",
        translations: {
          en: "Toast",
          no: "Smørbrød"
        }
      },
      currentBilling: null,
      newBilling: {
        price: 100,
        billingPeriod: "month"
      },
      currentAvailableDays: [],
      newAvailableDays: [1]
    },
    {
      id: 3,
      name: {
        content: "common_hot_food",
        translations: {
          en: "Hot food",
          no: "Varmmat"
        }
      },
      currentBilling: {
        price: 150,
        billingPeriod: "month"
      },
      newBilling: {
        price: 200,
        billingPeriod: "month"
      },
      currentAvailableDays: [2],
      newAvailableDays: [2]
    }
  ])
}