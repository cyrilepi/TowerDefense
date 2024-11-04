export function extractPath(map, layerName) {
    const layer = map.getObjectLayer(layerName);
    const path = [];
    const numberCasePath = layer.objects.length;
    for (let index = 0; index < numberCasePath; index++) {
        path.push(layer.objects[index]);
    }
    return path;
}