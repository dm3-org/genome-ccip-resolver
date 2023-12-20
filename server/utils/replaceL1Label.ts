export const replaceL1Label = (name: string) => {
    const genomePostfix = "gno";

    
    const nameComponents = name.split(".");
    nameComponents[nameComponents.length - 1] = genomePostfix;

    return nameComponents.join(".");

}