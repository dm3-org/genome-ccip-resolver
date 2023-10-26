import { ethers } from "ethers";


export function trimEthLabel(name: string): string {
    const dnsDecoded = dnsDecode(ethers.utils.toUtf8String(name));
    const ethLabel = ".eth"

    return dnsDecoded.replace(ethLabel, "")
}

function dnsDecode(encodedName: string): string {
    // Remove the trailing "00" which marks the end of the DNS name
    encodedName = encodedName.slice(0, -1);

    const nameComponents: string[] = [];
    let currentIndex = 0;

    while (currentIndex < encodedName.length) {
        const length = encodedName.charCodeAt(currentIndex);

        // Check if it's a valid DNS encoded entry
        if (length > 63) {
            throw new Error("Invalid DNS encoded entry; invalid length");
        }

        currentIndex++;

        // Extract the component from the encoded string
        const component = encodedName.slice(currentIndex, currentIndex + length);

        nameComponents.push(component);

        currentIndex += length;
    }


    // Join the components to reconstruct the original name
    return nameComponents.join('.');
}
