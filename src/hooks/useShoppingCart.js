import { useShoppingCart as usc} from "use-shopping-cart"
import { isBrowser } from "../utils/helper-functions"

export const useShoppingCart = () => {
  if (isBrowser()) {
    return usc()
  }
  else {
    return {}
  }
}