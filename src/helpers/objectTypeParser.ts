export function ObjectTypeParser(key: string, value: string) {
    if (key === "priceMin" || key === "priceMax") return Number.parseFloat(value)

    if (key === "createdAt") return new Date(value)

    if (key === "tags") return value.replaceAll("[", "").replaceAll("]", "").replaceAll("\"", "").split(",")

    if (key === "categories") return value.replaceAll("[", "").replaceAll("]", "").replaceAll("\"", "").split(",")
 
    if (key === "sortUp") {
        return value === "true" ? true : false
    }
}