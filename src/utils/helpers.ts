/**
 * Controleert of een ordinal een Taproot Alpha is
 */
export const isTaprootAlpha = (ordinal: any): boolean => {
  if (!ordinal) return false;
  
  // Debug logging - uitgeschakeld om console vervuiling te verminderen
  // console.log('Checking if ordinal is Taproot Alpha:', ordinal.id || 'unknown-id');
  
  // 1. Extra specifieke check op ID patroon (aangepast voor jouw specifieke inscription)
  const knownTaprootPrefixes = [
    '47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di',
    '97ec6f10aa9ea5c23a4408f2b90b1b5fac52ddd5c446348ee26553a73c29f7ffi', // Voeg eventueel andere bekende prefixes toe
    '39f7fa5d6b5575b8ab23019a65c4a5428ab5f7a67b0dbdc2a0091de0f9bd2bb4i'
  ];
  
  // 2. Check op specifieke ID patronen
  const hasKnownPrefix = ordinal.id && knownTaprootPrefixes.some(prefix => 
    ordinal.id.startsWith(prefix) || ordinal.id.includes(prefix)
  );
  
  // 3. Check op speciale vlaggen
  const hasTaprootFlag = ordinal.isTaprootAlpha === true;
  
  // 4. Check op de naam - Taproot Alpha's hebben vaak "Taproot" of "Alpha" in de naam
  const nameCheck = ordinal.name && (
    ordinal.name.toLowerCase().includes('taproot') || 
    ordinal.name.toLowerCase().includes('alpha')
  );
  
  // 5. Check op collectie - Dit helpt als de naam zelf geen "Taproot" bevat
  const collectionCheck = ordinal.collection && (
    ordinal.collection.toLowerCase().includes('taproot') || 
    ordinal.collection.toLowerCase().includes('alpha')
  );
  
  // 6. Check op content type
  const contentTypeCheck = ordinal.content_type && (
    ordinal.content_type.includes('image') ||
    ordinal.content_type.includes('text/html')
  );
  
  // 7. Check op de image URL/content type
  const imageCheck = ordinal.image && (
    ordinal.image.includes('taproot') ||
    ordinal.image.includes('alpha')
  );
  
  // 8. Check op metadata
  const metaCheck = ordinal.meta && (
    (ordinal.meta.name && (
      ordinal.meta.name.toLowerCase().includes('taproot') || 
      ordinal.meta.name.toLowerCase().includes('alpha')
    )) ||
    (ordinal.meta.collection && (
      ordinal.meta.collection.toLowerCase().includes('taproot') || 
      ordinal.meta.collection.toLowerCase().includes('alpha')
    ))
  );
  
  // Combineer alle checks - als één van de checks slaagt, is het een Taproot Alpha
  const result = hasKnownPrefix || hasTaprootFlag || nameCheck || collectionCheck || contentTypeCheck || imageCheck || metaCheck;
  
  // Debug logging voor positieve gevallen - uitgeschakeld om console vervuiling te verminderen
  /* 
  if (result) {
    console.log(`Found Taproot Alpha: ${ordinal.id}, name: ${ordinal.name || 'unnamed'}`);
    console.log('Matches criteria:', {
      hasKnownPrefix,
      hasTaprootFlag,
      nameCheck,
      collectionCheck,
      contentTypeCheck,
      imageCheck,
      metaCheck
    });
  }
  */
  
  return result;
}; 