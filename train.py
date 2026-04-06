import argparse
import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.metrics import classification_report, confusion_matrix
from model import build_model


def find_dataset_root(base_dir):
    if os.path.exists(base_dir) and os.path.isdir(base_dir):
        for candidate in sorted(os.listdir(base_dir)):
            candidate_path = os.path.join(base_dir, candidate)
            if os.path.isdir(candidate_path):
                nested = os.path.join(candidate_path, candidate)
                if os.path.isdir(nested):
                    dataset_root = nested
                else:
                    dataset_root = candidate_path
                if os.path.isdir(os.path.join(dataset_root, "train")) and os.path.isdir(os.path.join(dataset_root, "validation")):
                    return dataset_root
    return None


def evaluate_test_set(model, test_dir, target_size=(224, 224), batch_size=16):
    test_datagen = ImageDataGenerator(rescale=1.0 / 255)
    test_gen = test_datagen.flow_from_directory(
        test_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode="binary",
        shuffle=False,
    )
    predictions = model.predict(test_gen, verbose=0)
    predicted_labels = (predictions.flatten() >= 0.5).astype(int)
    true_labels = test_gen.classes
    print("\nTest Evaluation")
    print(classification_report(true_labels, predicted_labels, target_names=list(test_gen.class_indices.keys())))
    print("Confusion Matrix:")
    print(confusion_matrix(true_labels, predicted_labels))


def train(dataset_dir, output_model, epochs=15, batch_size=16, target_size=(224, 224)):
    dataset_dir = os.path.normpath(dataset_dir)
    train_dir = os.path.join(dataset_dir, "train")
    val_dir = os.path.join(dataset_dir, "validation")

    train_datagen = ImageDataGenerator(rescale=1.0 / 255, horizontal_flip=True, zoom_range=0.2)
    val_datagen = ImageDataGenerator(rescale=1.0 / 255)

    train_gen = train_datagen.flow_from_directory(
        train_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode="binary",
    )
    val_gen = val_datagen.flow_from_directory(
        val_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode="binary",
    )

    model = build_model(input_shape=(target_size[0], target_size[1], 3))

    callbacks = [
        EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True),
        ModelCheckpoint(output_model, monitor="val_loss", save_best_only=True),
    ]

    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=callbacks,
    )

    model.save(output_model)
    print(f"Trained model saved to {output_model}")

    test_dir = os.path.join(dataset_dir, "test")
    if os.path.isdir(test_dir):
        evaluate_test_set(model, test_dir, target_size=target_size, batch_size=batch_size)

    return history


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train deepfake detection CNN")
    parser.add_argument(
        "--dataset_dir",
        type=str,
        default="../data set/Data Set 4/Data Set 4",
        help="Root dataset folder containing train/ and validation/ directories",
    )
    parser.add_argument("--output_model", type=str, default="../model/model.h5", help="Output path for saved model")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch_size", type=int, default=16)
    args = parser.parse_args()

    if not os.path.exists(args.dataset_dir):
        default_dataset = find_dataset_root(os.path.join(os.path.dirname(__file__), "..", "data set"))
        if default_dataset:
            print(f"Using detected dataset root: {default_dataset}")
            args.dataset_dir = default_dataset
        else:
            raise FileNotFoundError(
                f"Dataset directory not found: {args.dataset_dir}. Place your dataset under project/data set/ with train/ and validation/ folders."
            )

    train(args.dataset_dir, args.output_model, epochs=args.epochs, batch_size=args.batch_size)
