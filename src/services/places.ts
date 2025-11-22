export interface Place {
  name: string;
  type: string;
}

export const getTouristPlaces = async (
  latitude: number,
  longitude: number
): Promise<Place[]> => {
  try {
    const radius = 10000;
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"](around:${radius},${latitude},${longitude});
        way["tourism"](around:${radius},${latitude},${longitude});
        relation["tourism"](around:${radius},${latitude},${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Places API failed');
    }

    const data = await response.json();

    const places: Place[] = data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => ({
        name: element.tags.name,
        type: element.tags.tourism || 'attraction'
      }))
      .filter((place: Place, index: number, self: Place[]) =>
        index === self.findIndex((p) => p.name === place.name)
      )
      .slice(0, 5);

    return places;
  } catch (error) {
    console.error('Places error:', error);
    return [];
  }
};