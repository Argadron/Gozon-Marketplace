export function ObjectTypeParser(key: string, value: string) {
    if (key === "priceMin" || key === "priceMax") return Number.parseFloat(value)

    if (key === "createdAt") return new Date(value)

    if (key === "tags") return value.replace(/[\[\'\]"/']/g, "").split(",")

    if (key === "categories") return value.replace(/[\[\'\]"/']/g, "").split(",")
 
    if (key === "sortUp") {
        return value === "true" ? true : false
    } 
}