// this is a sample that you can use on json-generator.com
// to generate random users that fit our models
// once the json's are generated
// make sure you replace /male to /men and /female to /women in the photo url's
// you have to do that manually dont ask why

[
    '{{repeat(2)}}',
    {
        Username: '{{firstName()}}',
        Gender: '{{gender()}}',
        DateOfBirth: '{{integer(1980,2000)}}-10-10',
        Created: '2020-10-10',
        LastActive: '2020-10-10',
        Introduction: '{{lorem(1)}}',
        LookingFor: '{{lorem(1)}}',
        Interests: '{{lorem(1)}}',
        City: '{{city()}}',
        Country: 'Canada',
        Photos: [
            {
                url: "https://randomuser.me/api/portraits/{{gender()}}/{{integer(0, 100)}}.jpg",
                isMain: true,
                description: '{{lorem(1)}}'
            }
        ]
    }
]