#!/bin/bash

# TODO: Revise script to make it compress the images and scale them down to like 480 or 720p before serving them
# TODO: remove annoying . in the file path

# To identify ones that didnt work, just search: "img": "http
# this should give us a good idea of broken links and other weird errors

# Usage: ./download_urls.sh ../../json/g.json ./g

# you need jq, wget and imagemagick

# I know my webp conversion shit is depricated, I dont care.

JSON_FILE_PATH="$1"
SUBDIRECTORY="$2"
ROOT_DIR="../../"

IMAGE_OUTPUT_DIR="${ROOT_DIR}/assets/imgs/${SUBDIRECTORY}"

mkdir -p "$IMAGE_OUTPUT_DIR"

TEMP_IMAGE="temp_image"

jq -c '.[]' "$JSON_FILE_PATH" | while read -r entry; do
    name=$(echo "$entry" | jq -r '.name' | sed 's/[^a-zA-Z0-9]/_/g')
    image_url=$(echo "$entry" | jq -r '.img')
    image_name="${name}.webp"
    image_path="${IMAGE_OUTPUT_DIR}/${image_name}"

    if [ -n "$image_url" ]; then
        wget -O "$TEMP_IMAGE" "$image_url"
        if [ $? -ne 0 ]; then
            echo "Failed to download image from $image_url, fucking looser"
            continue
        fi

        convert "$TEMP_IMAGE" "$image_path"
        if [ $? -ne 0 ]; then
            echo "Failed to convert image to webp format: $image_url, big L"
            continue
        fi

        rm "$TEMP_IMAGE"
                            # here is where we need to remove /./ if I do `./a` instead of just `a`
        absolute_image_path="/assets/imgs/${SUBDIRECTORY}/${image_name}"
        jq --arg url "$image_url" --arg img "$absolute_image_path" 'map(if .img == $url then .img = $img else . end)' "$JSON_FILE_PATH" > tmp.$$.json && mv tmp.$$.json "$JSON_FILE_PATH"
    fi
done

echo "JSON file has been updated with new image paths :D, I take back what I said about the failed images"


# every time it errors, make it increment by 1, and show the amount of errors, and the lines they occured at. I am far to stupid on 2 days without sleep to do tis my self, and I have such shitty internet that chatgpt doesnt work :c