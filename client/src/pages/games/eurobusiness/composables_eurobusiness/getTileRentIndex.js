export default function getTileRentIndex(position, playersData) {
    for (const player of playersData) {
        for (const property of Object.keys(player?.properties)) {
            if (property === position) {
                return player?.properties[position];
            }
        }
    }
    return 0;
}
